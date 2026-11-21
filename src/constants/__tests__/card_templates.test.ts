import fs from 'fs';
import path from 'path';

import { BUTTON_CUSTOM_TEMPLATES, CARD_TEMPLATES, CardStage } from '@/constants/card_templates';
import { STAGE_IMAGE_OUTLINES } from '@/constants/stage_image_outlines';
import { TYPE_ICONS } from '@/constants/type_icons';

const TEMPLATES_DIR = path.join(__dirname, '../../../assets/images/templates/pokemon');
const STAGES = Object.keys(CARD_TEMPLATES) as CardStage[];

// Templates que ainda não têm ícone em type_icons, por isso não aparecem no seletor de tipo (TypeModal)
const TEMPLATES_WITHOUT_ICON = ['dragon_old_2'];

// Largura real do PNG, lida do cabeçalho do arquivo (chunk IHDR)
const pngWidth = (stage: CardStage, id: string) =>
  fs.readFileSync(path.join(TEMPLATES_DIR, stage, `${id}.png`)).readUInt32BE(16);

describe('templates de carta', () => {
  it('os três estágios têm os mesmos templates', () => {
    const [basic, ...others] = STAGES.map((stage) => Object.keys(CARD_TEMPLATES[stage]).sort());
    for (const ids of others) expect(ids).toEqual(basic);
  });

  it('todo template tem um ícone de tipo com o mesmo id', () => {
    const withoutIcon = Object.keys(CARD_TEMPLATES.basic).filter((id) => !(id in TYPE_ICONS));
    expect(withoutIcon.sort()).toEqual([...TEMPLATES_WITHOUT_ICON].sort());
  });

  it.each(STAGES)('BUTTON_CUSTOM_TEMPLATES lista exatamente os templates de 3068px (%s)', (stage) => {
    const wide = Object.keys(CARD_TEMPLATES[stage]).filter((id) => pngWidth(stage, id) === 3068);
    expect([...BUTTON_CUSTOM_TEMPLATES].sort()).toEqual(wide.sort());
  });

  it.each(['stage_1', 'stage_2'] as const)('toda largura de template de %s tem o contorno da foto', (stage) => {
    const widths = new Set(Object.keys(CARD_TEMPLATES[stage]).map((id) => pngWidth(stage, id)));
    expect([...widths].filter((width) => !STAGE_IMAGE_OUTLINES[width])).toEqual([]);
  });
});
