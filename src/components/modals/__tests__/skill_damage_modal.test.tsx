import { render, screen } from '@testing-library/react-native';

import { SkillDamageModal } from '@/components/modals/skill_damage_modal';

describe('SkillDamageModal', () => {
  it('tem o título "Dano do Movimento"', async () => {
    await render(<SkillDamageModal visible onClose={jest.fn()} onSave={jest.fn()} />);

    expect(screen.getByText('Dano do Movimento')).toBeOnTheScreen();
  });
});
