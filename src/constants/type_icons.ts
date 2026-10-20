import { ImageSourcePropType } from 'react-native';

const BASE_URL = '../../assets/images/icons/pokemon_types';

export type TypeIcon = { id: string; source: ImageSourcePropType };

export const TYPES_CURRENT: TypeIcon[] = [
  { id: 'bug', source: require(`${BASE_URL}/bug.png`) },
  { id: 'dark', source: require(`${BASE_URL}/dark.png`) },
  { id: 'dragon', source: require(`${BASE_URL}/dragon.png`) },
  { id: 'earth', source: require(`${BASE_URL}/earth.png`) },
  { id: 'eletric', source: require(`${BASE_URL}/eletric.png`) },
  { id: 'fairy', source: require(`${BASE_URL}/fairy.png`) },
  { id: 'fighter', source: require(`${BASE_URL}/fighter.png`) },
  { id: 'fire', source: require(`${BASE_URL}/fire.png`) },
  { id: 'flying', source: require(`${BASE_URL}/flying.png`) },
  { id: 'ghost', source: require(`${BASE_URL}/ghost.png`) },
  { id: 'grass', source: require(`${BASE_URL}/grass.png`) },
  { id: 'ice', source: require(`${BASE_URL}/ice.png`) },
  { id: 'metal', source: require(`${BASE_URL}/metal.png`) },
  { id: 'normal', source: require(`${BASE_URL}/normal.png`) },
  { id: 'poison', source: require(`${BASE_URL}/poison.png`) },
  { id: 'psychic', source: require(`${BASE_URL}/psychic.png`) },
  { id: 'rock', source: require(`${BASE_URL}/rock.png`) },
  { id: 'water', source: require(`${BASE_URL}/water.png`) },
];

export const TYPES_OLD: TypeIcon[] = [
  { id: 'bug_old', source: require(`${BASE_URL}/bug_old.png`) },
  { id: 'dark_old', source: require(`${BASE_URL}/dark_old.png`) },
  { id: 'dragon_old', source: require(`${BASE_URL}/dragon_old.png`) },
  { id: 'earth_old', source: require(`${BASE_URL}/earth_old.png`) },
  { id: 'eletric_old', source: require(`${BASE_URL}/eletric_old.png`) },
  { id: 'fairy_old', source: require(`${BASE_URL}/fairy_old.png`) },
  { id: 'fighter_old', source: require(`${BASE_URL}/fighter_old.png`) },
  { id: 'fire_old', source: require(`${BASE_URL}/fire_old.png`) },
  { id: 'flying_old', source: require(`${BASE_URL}/flying_old.png`) },
  { id: 'ghost_old', source: require(`${BASE_URL}/ghost_old.png`) },
  { id: 'grass_old', source: require(`${BASE_URL}/grass_old.png`) },
  { id: 'ice_old', source: require(`${BASE_URL}/ice_old.png`) },
  { id: 'metal_old', source: require(`${BASE_URL}/metal_old.png`) },
  { id: 'normal_old', source: require(`${BASE_URL}/normal_old.png`) },
  { id: 'poison_old', source: require(`${BASE_URL}/poison_old.png`) },
  { id: 'psychic_old', source: require(`${BASE_URL}/psychic_old.png`) },
  { id: 'rock_old', source: require(`${BASE_URL}/rock_old.png`) },
  { id: 'water_old', source: require(`${BASE_URL}/water_old.png`) },
];

export const TYPES_OLD_2: TypeIcon[] = [
  { id: 'dark_old_2', source: require(`${BASE_URL}/dark_old_2.png`) },
  { id: 'eletric_old_2', source: require(`${BASE_URL}/eletric_old_2.png`) },
  { id: 'fighter_old_2', source: require(`${BASE_URL}/fighter_old_2.png`) },
  { id: 'fire_old_2', source: require(`${BASE_URL}/fire_old_2.png`) },
  { id: 'grass_old_2', source: require(`${BASE_URL}/grass_old_2.png`) },
  { id: 'metal_old_2', source: require(`${BASE_URL}/metal_old_2.png`) },
  { id: 'normal_old_2', source: require(`${BASE_URL}/normal_old_2.png`) },
  { id: 'psychic_old_2', source: require(`${BASE_URL}/psychic_old_2.png`) },
  { id: 'water_old_2', source: require(`${BASE_URL}/water_old_2.png`) },
];

export const TYPE_ICONS: Record<string, ImageSourcePropType> = Object.fromEntries(
  [...TYPES_CURRENT, ...TYPES_OLD, ...TYPES_OLD_2].map((type) => [type.id, type.source])
);
