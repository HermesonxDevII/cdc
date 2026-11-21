// Trava de testes do Claude Code (ver .claude/settings.json):
//   node verify-gate.js prompt -> hook UserPromptSubmit: guarda a "impressão digital" do código no início da resposta
//   node verify-gate.js stop   -> hook Stop: se o Claude mudou o código nessa resposta, roda `npm run verify`
//                                 (type-check + testes) e, se falhar, devolve a saída para ele corrigir
// Para não entrar em loop, bloqueia no máximo MAX_BLOCKS vezes seguidas; depois só avisa o usuário.
const { execFileSync, spawnSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const STATE_FILE = path.join(ROOT, '.claude', '.verify-state.json');
const WATCHED = ['src', 'assets', 'jest.setup.ts', 'package.json', 'tsconfig.json'];
const MAX_BLOCKS = 3;
const MAX_REASON_CHARS = 8000;

const readJson = (text) => {
  try {
    return JSON.parse(text) || {};
  } catch {
    return {};
  }
};
const mode = process.argv[2];
const input = readJson(fs.readFileSync(0, 'utf8'));
const state = readJson(fs.existsSync(STATE_FILE) ? fs.readFileSync(STATE_FILE, 'utf8') : '');
const save = () => fs.writeFileSync(STATE_FILE, JSON.stringify(state));

// Impressão digital do código: diff contra o último commit + conteúdo dos arquivos novos.
// null = nada mudou desde o último commit (que já passou pelo pre-commit).
const fingerprint = () => {
  const git = (...args) =>
    execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  const diff = git('diff', 'HEAD', '--binary', '--no-color', '--', ...WATCHED);
  const untracked = git('ls-files', '--others', '--exclude-standard', '-z', '--', ...WATCHED)
    .split('\0')
    .filter(Boolean);
  if (!diff && untracked.length === 0) return null;

  const hash = crypto.createHash('sha256').update(diff);
  for (const file of untracked) hash.update(file).update(fs.readFileSync(path.join(ROOT, file)));
  return hash.digest('hex');
};

let current;
try {
  current = fingerprint();
} catch {
  process.exit(0); // sem git disponível: não trava a sessão
}

if (mode === 'prompt') {
  state.turnStart = current;
  state.blocks = 0;
  save();
  process.exit(0);
}

// Daqui em diante: hook Stop
if (!input.stop_hook_active) state.blocks = 0;
if (current === null || current === state.turnStart || current === state.passed) process.exit(0);

const result = spawnSync('npm run verify', {
  cwd: ROOT,
  shell: true,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
if (result.status === 0) {
  state.passed = current;
  state.blocks = 0;
  save();
  process.exit(0);
}

const output = [result.stdout, result.stderr, result.error && result.error.message]
  .filter(Boolean)
  .join('\n')
  .replace(/\x1b\[[0-9;]*m/g, '') // tira as cores do terminal, que só gastariam tokens
  .trim();
if ((state.blocks || 0) >= MAX_BLOCKS) {
  save();
  process.stdout.write(
    JSON.stringify({
      systemMessage: `npm run verify ainda falha depois de ${MAX_BLOCKS} tentativas do Claude. Confira antes de commitar.`,
    }),
  );
  process.exit(0);
}

state.blocks = (state.blocks || 0) + 1;
save();
process.stdout.write(
  JSON.stringify({
    decision: 'block',
    reason:
      'npm run verify falhou. Corrija o código ou os testes (sem afrouxar os testes) antes de encerrar.\n\n' +
      output.slice(-MAX_REASON_CHARS),
  }),
);
