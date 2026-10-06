import { Text, TextProps } from 'react-native';

export function ResponsiveText(props: TextProps) {
  return (
    <Text
      allowFontScaling={false}
      adjustsFontSizeToFit={true}
      {...props}
    />
  );
}
