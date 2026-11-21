import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { MenuModal } from '@/components/modals/menu_modal';

const renderMenu = (editMovesDescription: boolean, onSelectEditMovesDescription = jest.fn()) =>
  render(
    <MenuModal
      visible
      onClose={jest.fn()}
      currentTemplate="normal"
      stage="basic"
      onSelectStage={jest.fn()}
      movesCount={2}
      onSelectMovesCount={jest.fn()}
      hasPassiveSkill={false}
      onSelectPassiveSkill={jest.fn()}
      weaknessesCount={1}
      onSelectWeaknessesCount={jest.fn()}
      resistancesCount={1}
      onSelectResistancesCount={jest.fn()}
      editMovesDescription={editMovesDescription}
      onSelectEditMovesDescription={onSelectEditMovesDescription}
    />,
  );

// Só a linha da opção (label + select), para não confundir com o Sim/Não da opção Habilidade
const editMovesDescriptionRow = () => within(screen.getByText('Editar desc. de Mov.:').parent!);

describe('MenuModal: Editar desc. de Mov.', () => {
  it('mostra o valor atual no select', async () => {
    await renderMenu(true);
    expect(editMovesDescriptionRow().getByText('Sim')).toBeOnTheScreen();
  });

  it('abre as opções Sim/Não e salva a escolhida', async () => {
    const onSelect = jest.fn();
    await renderMenu(false, onSelect);

    await fireEvent.press(editMovesDescriptionRow().getByText('Não'));
    await fireEvent.press(editMovesDescriptionRow().getByText('Sim'));

    expect(onSelect).toHaveBeenCalledWith(true);
    expect(editMovesDescriptionRow().queryByText('Sim')).not.toBeOnTheScreen(); // o dropdown fechou
  });
});
