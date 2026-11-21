import { fireEvent, render, screen } from '@testing-library/react-native';

import { NameModal } from '@/components/modals/name_modal';

describe('NameModal', () => {
  // O aviso de erro some com um setTimeout de 3s
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('não salva um nome vazio e mostra o aviso', async () => {
    const onSave = jest.fn();
    await render(<NameModal visible onClose={jest.fn()} onSave={onSave} />);

    await fireEvent.press(screen.getByText('Salvar'));

    expect(screen.getByText('Digite um nome!')).toBeOnTheScreen();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('salva o nome digitado e fecha o modal', async () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    await render(<NameModal visible onClose={onClose} onSave={onSave} />);

    await fireEvent.changeText(screen.getByPlaceholderText('Nome do Pokémon'), 'Pikachu');
    await fireEvent.press(screen.getByText('Salvar'));

    expect(onSave).toHaveBeenCalledWith('Pikachu');
    expect(onClose).toHaveBeenCalled();
  });
});
