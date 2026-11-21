// Os modais usam useSafeAreaInsets, que precisa de um provider nativo: nos testes usamos o mock da lib
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
