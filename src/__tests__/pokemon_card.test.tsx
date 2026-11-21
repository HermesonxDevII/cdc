import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import PokemonCard from '@/app/pokemon/pokemon_card';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('react-native-view-shot', () => ({ captureRef: jest.fn() }));

const DEFAULT_ICONS = ['Desfazer', 'Salvar', 'Pré-visualizar', 'Refazer'];
const EDITOR_ICONS = [
  'Restaurar espaçamento da descrição',
  'Diminuir altura da linha',
  'Aumentar altura da linha',
  'Diminuir espaço entre letras',
  'Aumentar espaço entre letras',
];

// Troca uma opção do menu "Opções da Carta" e fecha o menu, como o usuário faz
const selectMenuOption = async (label: string, from: string, to: string) => {
  await fireEvent.press(screen.getByLabelText('Menu'));
  const row = () => within(screen.getByText(label).parent!);
  await fireEvent.press(row().getByText(from));
  await fireEvent.press(row().getByText(to));
  await fireEvent.press(screen.getByText('X'));
};
const setMovesDescriptionEditor = (from: 'Sim' | 'Não', to: 'Sim' | 'Não') =>
  selectMenuOption('Editar desc. de Mov.:', from, to);

const imagePlaceholder = () => screen.queryByText(/Clique aqui para/);
const isRendered = (label: string) => screen.queryByLabelText(label, { includeHiddenElements: true }) !== null;

describe('Bottom bar da carta', () => {
  it('mostra desfazer, salvar, pré-visualizar, refazer e menu por padrão', async () => {
    await render(<PokemonCard />);

    for (const label of [...DEFAULT_ICONS, 'Menu']) expect(screen.getByLabelText(label)).toBeOnTheScreen();
    for (const label of EDITOR_ICONS) expect(screen.queryByLabelText(label)).not.toBeOnTheScreen();
  });

  it('no modo editor de descrição troca os 4 primeiros ícones pelos 5 do editor e mantém o menu', async () => {
    await render(<PokemonCard />);
    await setMovesDescriptionEditor('Não', 'Sim');

    for (const label of [...EDITOR_ICONS, 'Menu']) expect(screen.getByLabelText(label)).toBeOnTheScreen();
    for (const label of DEFAULT_ICONS) expect(screen.queryByLabelText(label)).not.toBeOnTheScreen();
  });

  it('ligar e desligar o modo editor não conta como alteração da carta', async () => {
    await render(<PokemonCard />);
    await setMovesDescriptionEditor('Não', 'Sim');
    await setMovesDescriptionEditor('Sim', 'Não');

    // Nada para desfazer: o modo fica fora do histórico, como o preview
    expect(screen.getByLabelText('Desfazer')).toBeDisabled();
  });
});

describe('Boxes da carta no modo editor de descrição', () => {
  const costAndDamage = (move: string) => [`Custo do ${move}`, `Dano do ${move}`];

  // Como no preview: a box fica sem borda e sem fundo e não abre o modal, mas continua lá com o valor
  const expectPreviewLike = (label: string) => {
    const box = screen.getByLabelText(label);
    expect(box).toBeVisible();
    expect(box).toHaveStyle({ borderColor: 'transparent', backgroundColor: 'transparent' });
    expect(box).toBeDisabled();
  };
  const expectNormalBox = (label: string) => {
    expect(screen.getByLabelText(label)).toHaveStyle({ borderColor: 'white' });
    expect(screen.getByLabelText(label)).toBeEnabled();
  };

  it('com 2 movimentos deixa as outras boxes como no preview e mantém o nome e a descrição deles', async () => {
    await render(<PokemonCard />);
    expect(imagePlaceholder()).toBeOnTheScreen();

    await setMovesDescriptionEditor('Não', 'Sim');

    expectNormalBox('Movimento 1');
    expectNormalBox('Movimento 2');
    for (const label of [...costAndDamage('Movimento 1'), ...costAndDamage('Movimento 2')]) expectPreviewLike(label);
    expect(imagePlaceholder()).not.toBeOnTheScreen(); // como no preview, o "Clique aqui..." da imagem some
    // As condições de cada box continuam valendo: com 2 movimentos não há Habilidade nem Movimento único
    expect(isRendered('Habilidade')).toBe(false);
    expect(isRendered('Movimento único')).toBe(false);

    await setMovesDescriptionEditor('Sim', 'Não');
    expect(imagePlaceholder()).toBeOnTheScreen();
    for (const label of costAndDamage('Movimento 1')) expectNormalBox(label);
  });

  it('os valores das boxes continuam aparecendo', async () => {
    await render(<PokemonCard />);
    await fireEvent.press(screen.getByLabelText('Dano do Movimento 1'));
    await fireEvent.changeText(screen.getByPlaceholderText('Ex: 30, 50+, 10x'), '30');
    await fireEvent.press(screen.getByText('Salvar'));

    await setMovesDescriptionEditor('Não', 'Sim');

    expect(screen.getByText('30')).toBeVisible();
    expectPreviewLike('Dano do Movimento 1');
  });

  it('com Habilidade ligada mantém a Habilidade e o nome e a descrição do Movimento 2', async () => {
    await render(<PokemonCard />);
    await selectMenuOption('Habilidade:', 'Não', 'Sim');
    await setMovesDescriptionEditor('Não', 'Sim');

    expectNormalBox('Habilidade');
    expectNormalBox('Movimento 2');
    for (const label of costAndDamage('Movimento 2')) expectPreviewLike(label);
    expect(isRendered('Movimento 1')).toBe(false);
    expect(isRendered('Movimento único')).toBe(false);
  });

  it('com 1 movimento mantém só o nome e a descrição do Movimento único', async () => {
    await render(<PokemonCard />);
    await selectMenuOption('Movimentos:', '2', '1');
    await setMovesDescriptionEditor('Não', 'Sim');

    expectNormalBox('Movimento único');
    for (const label of costAndDamage('Movimento único')) expectPreviewLike(label);
    expect(isRendered('Movimento 1')).toBe(false);
    expect(isRendered('Movimento 2')).toBe(false);
  });
});

describe('Seleção de box no modo editor de descrição', () => {
  const BLUE = '#3B82F6';

  it('tocar numa box seleciona ela (azul) em vez de abrir o modal de edição', async () => {
    await render(<PokemonCard />);
    await setMovesDescriptionEditor('Não', 'Sim');

    await fireEvent.press(screen.getByLabelText('Movimento 1'));

    expect(screen.getByLabelText('Movimento 1')).toHaveStyle({ borderColor: BLUE });
    expect(screen.queryByText('1º Movimento')).not.toBeOnTheScreen();
  });

  it('só uma box fica selecionada por vez, e tocar de novo desmarca', async () => {
    await render(<PokemonCard />);
    await setMovesDescriptionEditor('Não', 'Sim');

    await fireEvent.press(screen.getByLabelText('Movimento 1'));
    await fireEvent.press(screen.getByLabelText('Movimento 2'));
    expect(screen.getByLabelText('Movimento 2')).toHaveStyle({ borderColor: BLUE });
    expect(screen.getByLabelText('Movimento 1')).toHaveStyle({ borderColor: 'white' });

    await fireEvent.press(screen.getByLabelText('Movimento 2'));
    expect(screen.getByLabelText('Movimento 2')).toHaveStyle({ borderColor: 'white' });
  });

  it('a box de Habilidade também é selecionável', async () => {
    await render(<PokemonCard />);
    await selectMenuOption('Habilidade:', 'Não', 'Sim');
    await setMovesDescriptionEditor('Não', 'Sim');

    await fireEvent.press(screen.getByLabelText('Habilidade'));

    expect(screen.getByLabelText('Habilidade')).toHaveStyle({ borderColor: BLUE });
    expect(screen.queryByText('Habilidade Passiva')).not.toBeOnTheScreen();
  });

  it('sair do modo limpa a seleção, e fora dele a box volta a abrir o modal', async () => {
    await render(<PokemonCard />);
    await setMovesDescriptionEditor('Não', 'Sim');
    await fireEvent.press(screen.getByLabelText('Movimento 1'));
    await setMovesDescriptionEditor('Sim', 'Não');

    expect(screen.getByLabelText('Movimento 1')).toHaveStyle({ borderColor: 'white' });
    await fireEvent.press(screen.getByLabelText('Movimento 1'));
    expect(screen.getByText('1º Movimento')).toBeOnTheScreen();
  });
});

describe('Espaçamento da descrição no modo editor', () => {
  const RESET = 'Restaurar espaçamento da descrição';
  const ARROWS = EDITOR_ICONS.filter((label) => label !== RESET);
  const styleOf = (element: { props: { style?: unknown } }) => StyleSheet.flatten(element.props.style as never) ?? {};

  // Preenche nome e descrição de um movimento/habilidade pelo modal (fora do modo editor)
  const fillSkill = async (boxLabel: string, name: string, description: string) => {
    await fireEvent.press(screen.getByLabelText(boxLabel));
    await fireEvent.changeText(screen.getByPlaceholderText(/^Ex: (Esporo Atordoante|Troca de Dano)$/), name);
    await fireEvent.changeText(screen.getByPlaceholderText(/^Ex: (Jogue uma moeda|No seu turno)/), description);
    await fireEvent.press(screen.getByText('Salvar'));
  };

  it('as setas mudam só a descrição da box selecionada, e o Girar só fica ativo com algum ajuste', async () => {
    await render(<PokemonCard />);
    await fillSkill('Movimento 1', 'Choque', 'Jogue uma moeda.');
    await fillSkill('Movimento 2', 'Raio', 'Cause 10 de dano.');
    await setMovesDescriptionEditor('Não', 'Sim');

    // Sem box selecionada: o Girar e as setas ficam apagados e não fazem nada
    for (const label of [RESET, ...ARROWS]) expect(screen.getByLabelText(label)).toBeDisabled();
    await fireEvent.press(screen.getByLabelText('Diminuir altura da linha'));
    expect(styleOf(screen.getByText(/Jogue uma moeda/)).lineHeight).toBeUndefined();

    // Com a box selecionada as setas acendem; o Girar só depois do primeiro ajuste
    await fireEvent.press(screen.getByLabelText('Movimento 1'));
    for (const label of ARROWS) expect(screen.getByLabelText(label)).toBeEnabled();
    expect(screen.getByLabelText(RESET)).toBeDisabled();

    await fireEvent.press(screen.getByLabelText('Diminuir altura da linha'));
    await fireEvent.press(screen.getByLabelText('Diminuir altura da linha'));
    await fireEvent.press(screen.getByLabelText('Aumentar espaço entre letras'));

    // Base do line height: altura natural da GillSans em 20px (23) menos 2 toques
    expect(screen.getByText(/Jogue uma moeda/)).toHaveStyle({ lineHeight: 21, letterSpacing: 0.25 });
    expect(styleOf(screen.getByText('Choque'))).toMatchObject({ letterSpacing: 0 }); // o nome não herda
    expect(styleOf(screen.getByText('Choque')).lineHeight).toBeUndefined();
    expect(styleOf(screen.getByText(/Cause 10 de dano/))).not.toHaveProperty('letterSpacing');
    expect(screen.getByLabelText(RESET)).toBeEnabled();

    // Desfazendo os ajustes pelas setas, a descrição volta ao padrão e o Girar desabilita de novo
    await fireEvent.press(screen.getByLabelText('Aumentar altura da linha'));
    await fireEvent.press(screen.getByLabelText('Aumentar altura da linha'));
    await fireEvent.press(screen.getByLabelText('Diminuir espaço entre letras'));
    expect(styleOf(screen.getByText(/Jogue uma moeda/))).not.toHaveProperty('lineHeight');
    expect(styleOf(screen.getByText(/Jogue uma moeda/))).not.toHaveProperty('letterSpacing');
    expect(screen.getByLabelText(RESET)).toBeDisabled();
  });

  it('o Girar volta a descrição do Movimento único para o padrão, sem mexer no nome', async () => {
    await render(<PokemonCard />);
    await selectMenuOption('Movimentos:', '2', '1');
    await fillSkill('Movimento único', 'Esporo', 'Jogue uma moeda.');
    await setMovesDescriptionEditor('Não', 'Sim');
    await fireEvent.press(screen.getByLabelText('Movimento único'));

    await fireEvent.press(screen.getByLabelText('Aumentar altura da linha'));
    await fireEvent.press(screen.getByLabelText('Diminuir espaço entre letras'));
    // Base do line height: altura natural da GillSans em 23px (27) mais 1 toque
    expect(screen.getByText('Jogue uma moeda.')).toHaveStyle({ lineHeight: 28, letterSpacing: -0.25 });
    expect(styleOf(screen.getByText('Esporo'))).not.toHaveProperty('lineHeight');
    expect(styleOf(screen.getByText('Esporo'))).not.toHaveProperty('letterSpacing');

    await fireEvent.press(screen.getByLabelText(RESET));
    expect(styleOf(screen.getByText('Jogue uma moeda.'))).not.toHaveProperty('lineHeight');
    expect(styleOf(screen.getByText('Jogue uma moeda.'))).not.toHaveProperty('letterSpacing');
    expect(screen.getByLabelText(RESET)).toBeDisabled();
  });

  it('na Habilidade o ajuste fica só na descrição, e o nome não herda o letter spacing', async () => {
    await render(<PokemonCard />);
    await selectMenuOption('Habilidade:', 'Não', 'Sim');
    await fillSkill('Habilidade', 'Troca de Dano', 'Mova 1 marcador de dano.');
    await setMovesDescriptionEditor('Não', 'Sim');
    await fireEvent.press(screen.getByLabelText('Habilidade'));

    await fireEvent.press(screen.getByLabelText('Aumentar espaço entre letras'));

    expect(screen.getByText(/Mova 1 marcador de dano/)).toHaveStyle({ letterSpacing: 0.25 });
    // "Poder Pokémon: <nome>" é o texto do nome, dentro do parágrafo da descrição
    expect(styleOf(screen.getByText('Troca de Dano').parent!)).toMatchObject({ letterSpacing: 0 });
  });

  it('trocar Movimentos ou Habilidade no menu tira a seleção e apaga as setas', async () => {
    const BLUE = '#3B82F6';
    await render(<PokemonCard />);
    await setMovesDescriptionEditor('Não', 'Sim');
    await fireEvent.press(screen.getByLabelText('Movimento 2'));
    expect(screen.getByLabelText('Movimento 2')).toHaveStyle({ borderColor: BLUE });

    // Ligar a Habilidade deixa 1 movimento; o Movimento 2 continua na tela, mas a seleção sai
    await selectMenuOption('Habilidade:', 'Não', 'Sim');
    expect(screen.getByLabelText('Movimento 2')).toHaveStyle({ borderColor: 'white' });
    for (const label of ARROWS) expect(screen.getByLabelText(label)).toBeDisabled();

    await fireEvent.press(screen.getByLabelText('Habilidade'));
    await selectMenuOption('Movimentos:', '1', '2'); // volta para 2 movimentos, e a Habilidade some
    expect(isRendered('Habilidade')).toBe(false);
    for (const label of ['Movimento 1', 'Movimento 2']) {
      expect(screen.getByLabelText(label)).toHaveStyle({ borderColor: 'white' });
    }
    for (const label of ARROWS) expect(screen.getByLabelText(label)).toBeDisabled();
  });
});
