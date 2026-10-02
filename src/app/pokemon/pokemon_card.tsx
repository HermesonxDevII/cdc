import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  BackHandler,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

import { Back } from "@/components/back";
import { TypeModal } from "@/components/modals/type_modal";
import { HpModal } from "@/components/modals/hp_modal";
import { NameModal } from "@/components/modals/name_modal";
import { DescriptionModal } from "@/components/modals/description_modal";
import { CuriosityModal } from "@/components/modals/curiosity_modal";
import { IllustrationModal } from "@/components/modals/illustration_modal";
import { PokemonNumberModal } from "@/components/modals/pokemon_number_modal";
import { LevelModal } from "@/components/modals/level_modal";
import { ExtraInfoModal } from "@/components/modals/extra_info_modal";
import { WeaknessModal } from "@/components/modals/weakness_modal";
import { ResistanceModal } from "@/components/modals/resistance_modal";
import { RetreatModal } from "@/components/modals/retreat_modal";
import { WeaknessValueModal } from "@/components/modals/weakness_value_modal";
import { ResistanceValueModal } from "@/components/modals/resistance_value_modal";
import { SkillModal } from "@/components/modals/skill_modal";
import { SkillDamageModal } from "@/components/modals/skill_damage_modal";
import { SkillEnergyModal } from "@/components/modals/skill_energy_modal";
import { DiscardChangesModal } from "@/components/modals/discard_changes_modal";
import { MenuModal } from "@/components/modals/menu_modal";
import { useRouter } from "expo-router";

// Mapeamento de todas as texturas de cartas baseadas no tipo
const BASE_URL = "../../../assets/images/templates/pokemon/basic";

const TEMPLATES: Record<string, any> = {
  dark: require(`${BASE_URL}/dark.png`),
  eletric: require(`${BASE_URL}/eletric.png`),
  fighter: require(`${BASE_URL}/fighter.png`),
  fire: require(`${BASE_URL}/fire.png`),
  grass: require(`${BASE_URL}/grass.png`),
  metal: require(`${BASE_URL}/metal.png`),
  normal: require(`${BASE_URL}/normal.png`),
  psychic: require(`${BASE_URL}/psychic.png`),
  water: require(`${BASE_URL}/water.png`),
};

type CardState = {
  currentTemplate: any;
  pokemonImage: string | null;
  hp: string;
  name: string;
  description: string;
  curiosity: string;
  illustration: string;
  pokemonNumber: string;
  level: string;
  extraInfo: string;
  weakness: string;
  secondWeakness: string | null;
  weaknessValue: string;
  resistance: string;
  secondResistance: string | null;
  resistanceValue: string;
  retreat: { symbol: string; count: number } | null;
  movesCount: number;
  weaknessesCount: number;
  resistancesCount: number;
  hasPassiveSkill: boolean;
  passiveSkill: { name: string; description: string; color?: string } | null;
  firstSkill: { name: string; description: string } | null;
  firstSkillDamage: string;
  firstSkillEnergy: { symbol: string; count: number } | null;
  secondSkill: { name: string; description: string } | null;
  secondSkillDamage: string;
  secondSkillEnergy: { symbol: string; count: number } | null;
};

const initialState: CardState = {
  currentTemplate: TEMPLATES.normal,
  pokemonImage: null,
  hp: "",
  name: "",
  description: "",
  curiosity: "",
  illustration: "",
  pokemonNumber: "",
  level: "",
  extraInfo: "",
  weakness: "",
  secondWeakness: null,
  weaknessValue: "",
  resistance: "",
  secondResistance: null,
  resistanceValue: "",
  retreat: null,
  movesCount: 2,
  weaknessesCount: 1,
  resistancesCount: 1,
  hasPassiveSkill: false,
  passiveSkill: null,
  firstSkill: null,
  firstSkillDamage: "",
  firstSkillEnergy: null,
  secondSkill: null,
  secondSkillDamage: "",
  secondSkillEnergy: null,
};

// Mapeamento dos símbolos (usado pela fraqueza e afins)
const ICONS_URL = "../../../assets/images/icons/pokemon_types";
const TYPE_ICONS: Record<string, any> = {
  // Atuais
  dark: require(`${ICONS_URL}/dark.png`),
  eletric: require(`${ICONS_URL}/eletric.png`),
  fighter: require(`${ICONS_URL}/fighter.png`),
  fire: require(`${ICONS_URL}/fire.png`),
  grass: require(`${ICONS_URL}/grass.png`),
  metal: require(`${ICONS_URL}/metal.png`),
  normal: require(`${ICONS_URL}/normal.png`),
  psychic: require(`${ICONS_URL}/psychic.png`),
  water: require(`${ICONS_URL}/water.png`),

  // Antigos (Clássico)
  dark_old: require(`${ICONS_URL}/dark_old.png`),
  eletric_old: require(`${ICONS_URL}/eletric_old.png`),
  fighter_old: require(`${ICONS_URL}/fighter_old.png`),
  fire_old: require(`${ICONS_URL}/fire_old.png`),
  grass_old: require(`${ICONS_URL}/grass_old.png`),
  metal_old: require(`${ICONS_URL}/metal_old.png`),
  normal_old: require(`${ICONS_URL}/normal_old.png`),
  psychic_old: require(`${ICONS_URL}/psychic_old.png`),
  water_old: require(`${ICONS_URL}/water_old.png`),

  // Antigos 2 (Retrô)
  dark_old_2: require(`${ICONS_URL}/dark_old_2.png`),
  eletric_old_2: require(`${ICONS_URL}/eletric_old_2.png`),
  fighter_old_2: require(`${ICONS_URL}/fighter_old_2.png`),
  fire_old_2: require(`${ICONS_URL}/fire_old_2.png`),
  grass_old_2: require(`${ICONS_URL}/grass_old_2.png`),
  metal_old_2: require(`${ICONS_URL}/metal_old_2.png`),
  normal_old_2: require(`${ICONS_URL}/normal_old_2.png`),
  psychic_old_2: require(`${ICONS_URL}/psychic_old_2.png`),
  water_old_2: require(`${ICONS_URL}/water_old_2.png`),
};

// 1. Definimos o tamanho REAL e gigante da carta para exportação
const CARD_REAL_WIDTH = 744;
const CARD_REAL_HEIGHT = 1045;

// 2. Pegamos a largura exata da tela do celular
const screenWidth = Dimensions.get("window").width;

// 3. Calculamos o fator de escala (zoom-out) para a carta ocupar 90% da tela
const cardScale = (screenWidth * 0.9) / CARD_REAL_WIDTH;

export default function PokemonCard() {
  const [isTypeModalVisible, setTypeModalVisible] = useState<boolean>(false);
  const [isHpModalVisible, setHpModalVisible] = useState<boolean>(false);
  const [isNameModalVisible, setNameModalVisible] = useState<boolean>(false);
  const [isDescriptionModalVisible, setDescriptionModalVisible] =
    useState<boolean>(false);
  const [isCuriosityModalVisible, setCuriosityModalVisible] = useState<boolean>(false);
  const [isIllustrationModalVisible, setIllustrationModalVisible] =
    useState<boolean>(false);
  const [isPokemonNumberModalVisible, setPokemonNumberModalVisible] =
    useState<boolean>(false);
  const [isLevelModalVisible, setLevelModalVisible] = useState<boolean>(false);
  const [isExtraInfoModalVisible, setExtraInfoModalVisible] = useState<boolean>(false);
  const [isWeaknessModalVisible, setWeaknessModalVisible] = useState<boolean>(false);
  const [isSecondWeaknessModalVisible, setSecondWeaknessModalVisible] = useState<boolean>(false);
  const [isResistanceModalVisible, setResistanceModalVisible] = useState<boolean>(false);
  const [isSecondResistanceModalVisible, setSecondResistanceModalVisible] = useState<boolean>(false);
  const [isRetreatModalVisible, setRetreatModalVisible] = useState<boolean>(false);
  const [isWeaknessValueModalVisible, setWeaknessValueModalVisible] = useState<boolean>(false);
  const [isResistanceValueModalVisible, setResistanceValueModalVisible] = useState<boolean>(false);
  const [isFirstSkillModalVisible, setFirstSkillModalVisible] = useState<boolean>(false);
  const [isFirstSkillDamageModalVisible, setFirstSkillDamageModalVisible] = useState<boolean>(false);
  const [isFirstSkillEnergyModalVisible, setFirstSkillEnergyModalVisible] = useState<boolean>(false);
  const [isSecondSkillModalVisible, setSecondSkillModalVisible] = useState<boolean>(false);
  const [isSecondSkillDamageModalVisible, setSecondSkillDamageModalVisible] = useState<boolean>(false);
  const [isSecondSkillEnergyModalVisible, setSecondSkillEnergyModalVisible] = useState<boolean>(false);
  const [isDiscardModalVisible, setDiscardModalVisible] = useState<boolean>(false);
  const [isMenuModalVisible, setMenuModalVisible] = useState<boolean>(false);
  const [isPassiveSkillModalVisible, setPassiveSkillModalVisible] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const cardRef = useRef<View>(null);

  const [history, setHistory] = useState<CardState[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const currentState = history[historyIndex];

  const updateCard = (updates: Partial<CardState>) => {
    const newState = { ...currentState, ...updates };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const redo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const {
    currentTemplate, pokemonImage, hp, name, description, curiosity,
    illustration, pokemonNumber, extraInfo, weakness, secondWeakness,
    weaknessValue, level, resistance, secondResistance, resistanceValue, retreat, movesCount,
    weaknessesCount, resistancesCount, hasPassiveSkill, passiveSkill, firstSkill, firstSkillDamage,
    firstSkillEnergy, secondSkill, secondSkillDamage, secondSkillEnergy
  } = currentState;

  const router = useRouter();

  const hasChanges = () => {
    return historyIndex > 0;
  };

  // Verifica se o usuário já fez alguma modificação e pergunta se ele quer descartar essas modificações
  const handleBack = () => {
    if (hasChanges()) {
      setDiscardModalVisible(true);
      return true;
    } else {
      router.push("/pokemon");
      return true;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => backHandler.remove();
  }, [historyIndex]);

  // Abre a galeria do usuário pra selecionar a imagem da carta
  const pickImage = async () => {
    // Pede permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, // Permite recortar a foto
      quality: 1,
    });

    if (!result.canceled) {
      updateCard({ pokemonImage: result.assets[0].uri });
    }
  };

  // Salva a carta no dispositivo do usuário
  const handleSaveCard = async () => {
    try {
      setIsPreviewMode(true);

      // Aguarda 300ms para garantir que o layout renderizou no Preview Mode
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (cardRef.current) {
        const uri = await captureRef(cardRef, {
          format: "png",
          quality: 1,
        });

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            dialogTitle: 'Salvar Carta Pokémon',
            mimeType: 'image/png'
          });
        } else {
          Alert.alert('Erro', 'O recurso de compartilhamento não está disponível no seu dispositivo.');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao exportar a imagem.');
      console.error(error);
    } finally {
      setIsPreviewMode(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Back href="/pokemon" onPress={handleBack} />

        {/* Wrapper que reserva o espaço reduzido na tela para não quebrar o layout */}
        <View style={styles.scaledWrapper}>

          {/* Carta real proporção de 744x1045 */}
          <View ref={cardRef} style={styles.realSizeCard}>
            <Image source={currentTemplate} style={styles.cardImage} />

            {/* ========= BEGIN:: Nome ========= */}
            <TouchableOpacity
              style={[styles.nameButton, isPreviewMode && styles.previewMode]}
              onPress={() => setNameModalVisible(true)}
              disabled={isPreviewMode}
            >
              {name ? <Text style={styles.nameText}>{name}</Text> : null }
            </TouchableOpacity>
            {/* ========= END:: Nome ========= */}

            {/* ========= BEGIN:: Level ========= */}
            <TouchableOpacity
              style={[
                styles.levelButton,
                isPreviewMode && styles.previewMode,
                { right: hp.length > 2 ? 285 : 260 }
              ]}
              onPress={() => setLevelModalVisible(true)}
              disabled={isPreviewMode}
            >
              {level ? <Text style={styles.levelText}>Nv.{level}</Text> : null}
            </TouchableOpacity>
            {/* ========= END:: Level ========= */}

            {/* ========= BEGIN:: HP ========= */}
            <TouchableOpacity
              style={[
                styles.hpButton,
                isPreviewMode && styles.previewMode,
                { width: hp.length > 2 ? 150 : 125 },
                isPreviewMode && { right: 115 }
              ]}
              onPress={() => setHpModalVisible(true)}
              disabled={isPreviewMode}
            >
              {hp ? <Text style={styles.hpText}>{hp} HP</Text> : null}
            </TouchableOpacity>
            {/* ========= END:: HP ========= */}

            {/* ========= BEGIN:: Tipo ========= */}
            <TouchableOpacity
              style={[styles.typeButton, isPreviewMode && styles.previewMode]}
              onPress={() => setTypeModalVisible(true)}
              disabled={isPreviewMode}
            />
            {/* ========= END:: Tipo ========= */}

            {/* ========= BEGIN:: Imagem ========= */}
            <TouchableOpacity
              style={[styles.imageButton, isPreviewMode && styles.previewMode]}
              onPress={pickImage}
              disabled={isPreviewMode}
            >
              {pokemonImage
                ? <Image source={{ uri: pokemonImage }} style={styles.pokemonImage} />
                : !isPreviewMode && (
                  <Text style={styles.imageButtonText}>
                    Clique aqui para{"\n"}adicionar uma imagem
                  </Text>
                )
              }
            </TouchableOpacity>
            {/* ========= END:: Imagem ========= */}

            {/* ========= BEGIN: Descrição ========= */}
            <TouchableOpacity
              style={[
                styles.descriptionButton,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setDescriptionModalVisible(true)}
              disabled={isPreviewMode}
            >
              {description ? (
                <Text style={styles.descriptionText}>{description}</Text>
              ) : null}
            </TouchableOpacity>
            {/* ========= END: Descrição ========= */}

            {/* ========= BEGIN:: Movimento 1 */}
            {movesCount === 2 && (
              <>
                {/* ========= BEGIN:: Custo ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillEnergyButton,
                    isPreviewMode && styles.previewMode,
                    isPreviewMode && firstSkillEnergy && firstSkillEnergy.count >= 3 && { top: 605 },
                  ]}
                  onPress={() => setFirstSkillEnergyModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkillEnergy ? (
                    <View style={styles.skillEnergyContainer}>
                      {Array.from({ length: firstSkillEnergy.count }).map((_, index) => (
                        <Image
                          key={index}
                          source={TYPE_ICONS[firstSkillEnergy.symbol]}
                          style={styles.skillEnergyIcon}
                        />
                      ))}
                    </View>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Custo ========= */}

                {/* ========= BEGIN:: Nome e descrição ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillButton,
                    isPreviewMode && styles.previewMode,
                    (!firstSkill?.description) && { justifyContent: 'center' },
                  ]}
                  onPress={() => setFirstSkillModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkill ? (
                    <Text style={styles.skillDescriptionText}>
                      <Text style={styles.skillNameText}>{firstSkill.name} </Text>
                      {firstSkill.description}
                    </Text>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Nome e descrição */}

                {/* ========= BEGIN:: Qtd. de Dano ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillDamageButton,
                    isPreviewMode && styles.previewMode,
                  ]}
                  onPress={() => setFirstSkillDamageModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkillDamage ? (
                    <Text style={styles.skillDamageText}>{firstSkillDamage}</Text>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Qtd. de Dano ========= */}
              </>
            )}
            {/* ========= END:: Movimento 1 */}

            {/* ========= BEGIN:: Movimento 2 */}
            {(movesCount === 2 || (movesCount === 1 && hasPassiveSkill)) && (
              <>
                {/* ========= BEGIN:: Custo ========= */}
                <TouchableOpacity
                  style={[
                    styles.secondSkillEnergyButton,
                    isPreviewMode && styles.previewMode,
                    isPreviewMode && secondSkillEnergy && secondSkillEnergy.count >= 3 && { top: 725 },
                  ]}
                  onPress={() => setSecondSkillEnergyModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {secondSkillEnergy ? (
                    <View style={styles.skillEnergyContainer}>
                      {Array.from({ length: secondSkillEnergy.count }).map((_, index) => (
                        <Image
                          key={index}
                          source={TYPE_ICONS[secondSkillEnergy.symbol]}
                          style={styles.skillEnergyIcon}
                        />
                      ))}
                    </View>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Custo ========= */}

                {/* ========= BEGIN:: Nome e descrição ========= */}
                <TouchableOpacity
                  style={[
                    styles.secondSkillButton,
                    isPreviewMode && styles.previewMode,
                    (!secondSkill?.description) && { justifyContent: 'center' },
                  ]}
                  onPress={() => setSecondSkillModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {secondSkill ? (
                    <Text style={styles.skillDescriptionText}>
                      <Text style={styles.skillNameText}>{secondSkill.name} </Text>
                      {secondSkill.description}
                    </Text>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Nome e descrição ========= */}

                {/* ========= BEGIN:: Qtd. de Dano ========= */}
                <TouchableOpacity
                  style={[
                    styles.secondSkillDamageButton,
                    isPreviewMode && styles.previewMode,
                  ]}
                  onPress={() => setSecondSkillDamageModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {secondSkillDamage ? (
                    <Text style={styles.skillDamageText}>{secondSkillDamage}</Text>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Qtd. de Dano ========= */}
              </>
            )}
            {/* ========= END:: Movimento 2 */}

            {/* ========= END:: Movimento unico */}
            {movesCount === 1 && !hasPassiveSkill && (
              <>
                {/* ========= BEGIN:: Custo ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillEnergyButton,
                    isPreviewMode && styles.previewMode,
                    { top: 670, height: 100 }
                  ]}
                  onPress={() => setFirstSkillEnergyModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkillEnergy ? (
                    <View style={styles.skillEnergyContainer}>
                      {Array.from({ length: firstSkillEnergy.count }).map((_, index) => (
                        <Image
                          key={index}
                          source={TYPE_ICONS[firstSkillEnergy.symbol]}
                          style={styles.skillEnergyIcon}
                        />
                      ))}
                    </View>
                  ) : null}
                </TouchableOpacity>
                {/* ========= BEGIN:: Custo ========= */}

                {/* ========= BEGIN:: Nome e descrição ========= */}
                <TouchableOpacity
                  style={[
                    styles.singleSkillButton,
                    isPreviewMode && styles.previewMode,
                  ]}
                  onPress={() => setFirstSkillModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkill ? (
                    <>
                      <Text style={[styles.skillNameText, { textAlign: 'center' }]}>{firstSkill.name} </Text>
                      {firstSkill.description ? (
                        <Text style={[styles.skillDescriptionText, { textAlign: 'left', marginTop: 5 }]}>{firstSkill.description}</Text>
                      ) : null}
                    </>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Nome e descrição ========= */}

                {/* ========= BEGIN:: Qtd. de Dano ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillDamageButton,
                    isPreviewMode && styles.previewMode,
                    { top: 670, height: 100 } // Valores provisórios centralizados
                  ]}
                  onPress={() => setFirstSkillDamageModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkillDamage ? (
                    <Text style={styles.skillDamageText}>{firstSkillDamage}</Text>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Qtd. de Dano ========= */}
              </>
            )}
            {/* ========= END:: Movimento unico */}

            {/* ========= BEGIN:: Habilidade */}
            {hasPassiveSkill && (
              <TouchableOpacity
                style={[
                  styles.passiveSkillButton,
                  isPreviewMode && styles.previewMode,
                  (!passiveSkill?.description) && { justifyContent: 'center' },
                ]}
                onPress={() => setPassiveSkillModalVisible(true)}
                disabled={isPreviewMode}
              >
                {passiveSkill ? (
                  <Text style={[styles.skillDescriptionText, { width: '100%' }]}>
                    <Text style={[styles.skillNameText, { color: passiveSkill.color || '#CC0000', fontSize: 25 }]}>
                      Poder Pokémon: <Text style={{ color: passiveSkill.color }}>{passiveSkill.name} </Text>
                    </Text>
                    {passiveSkill.description}
                  </Text>
                ) : null}
              </TouchableOpacity>
            )}
            {/* ========= END:: Habilidade */}

            {/* ========= BEGIN:: Fraquezas ========= */}
            {/* ========= BEGIN:: Fraqueza 1 ========= */}
            <TouchableOpacity
              style={[
                styles.weaknessButton,
                weaknessesCount === 2 && { left: 89 },
                isPreviewMode && styles.previewMode,
                isPreviewMode && {
                  width: 40,
                  height: 40,
                  top: 865, // Posição perfeita que você encontrou para o preview
                  left: weaknessesCount === 2 ? 90 : 110 // Mantém a lógica de preview também ajustada
                },
              ]}
              onPress={() => setWeaknessModalVisible(true)}
              disabled={isPreviewMode}
            >
              {weakness ? (
                <Image source={TYPE_ICONS[weakness]} style={styles.weaknessIcon} />
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Fraqueza 1 ========= */}

            {/* ========= BEGIN:: Fraqueza 2 ========= */}
            {weaknessesCount === 2 && (
              <TouchableOpacity
                style={[
                  styles.secondWeaknessButton,
                  isPreviewMode && styles.previewMode,
                  isPreviewMode && {
                    width: 40,
                    height: 40,
                    top: 865,
                    left: 135,
                  },
                ]}
                onPress={() => setSecondWeaknessModalVisible(true)}
                disabled={isPreviewMode}
              >
                {secondWeakness ? (
                  <Image source={TYPE_ICONS[secondWeakness]} style={styles.weaknessIcon} />
                ) : null}
              </TouchableOpacity>
            )}
            {/* ========= END:: Fraqueza 2 ========= */}

            {/* ========= BEGIN:: Valor das fraquezas ========= */}
            <TouchableOpacity
              style={[
                styles.weaknessValueButton,
                weaknessesCount === 2 && { left: 185 },
                isPreviewMode && styles.previewMode,
                isPreviewMode && { left: weaknessesCount === 2 ? 180 : 150 }, // Ajuste para modo preview
              ]}
              onPress={() => setWeaknessValueModalVisible(true)}
              disabled={isPreviewMode}
            >
              {weaknessValue ? (
                <Text style={styles.weaknessValueText}>{weaknessValue}</Text>
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Valor das fraquezas ========= */}
            {/* ========= END:: Fraquezas ========= */}

            {/* ========= BEGIN:: Resistências ========= */}
            {/* ========= BEGIN:: Resistência 1 ========= */}
            <TouchableOpacity
              style={[
                styles.resistanceButton,
                resistancesCount === 2 && { left: 316 },
                isPreviewMode && styles.previewMode,
                isPreviewMode && {
                  width: 40,
                  height: 40,
                  top: 865,
                  left: resistancesCount === 2 ? 317 : 338
                },
              ]}
              onPress={() => setResistanceModalVisible(true)}
              disabled={isPreviewMode}
            >
              {resistance ? (
                <Image source={TYPE_ICONS[resistance]} style={styles.resistanceIcon} />
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Resistência 1 ========= */}

            {/* ========= BEGIN:: Resistência 2 ========= */}
            {resistancesCount === 2 && (
              <TouchableOpacity
                style={[
                  styles.secondResistanceButton,
                  isPreviewMode && styles.previewMode,
                  isPreviewMode && {
                    width: 40,
                    height: 40,
                    top: 865,
                    left: 365
                  },
                ]}
                onPress={() => setSecondResistanceModalVisible(true)}
                disabled={isPreviewMode}
              >
                {secondResistance ? (
                  <Image source={TYPE_ICONS[secondResistance]} style={styles.resistanceIcon} />
                ) : null}
              </TouchableOpacity>
            )}
            {/* ========= END:: Resistência 2 ========= */}

            {/* ========= BEGIN:: Valor das resistências ========= */}
            <TouchableOpacity
              style={[
                styles.resistanceValueButton,
                resistancesCount === 2 && { left: 412 },
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setResistanceValueModalVisible(true)}
              disabled={isPreviewMode}
            >
              {resistanceValue ? (
                <Text style={styles.resistanceValueText}>{resistanceValue}</Text>
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Valor das resistências ========= */}
            {/* ========= END:: Resistências ========= */}

            {/* BEGIN:: Custo de retirada */}
            <TouchableOpacity
              style={[
                styles.retreatButton,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setRetreatModalVisible(true)}
              disabled={isPreviewMode}
            >
              {retreat ? (
                <View style={{ flexDirection: 'row', gap: 2 }}>
                  {Array.from({ length: retreat.count }).map((_, i) => (
                    <Image key={i} source={TYPE_ICONS[retreat.symbol]} style={styles.retreatIcon} />
                  ))}
                </View>
              ) : null}
            </TouchableOpacity>
            {/* END:: Custo de retirada */}

            {/* BEGIN:: Curiosidade */}
            <TouchableOpacity
              style={[
                styles.curiosityButton,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setCuriosityModalVisible(true)}
              disabled={isPreviewMode}
            >
              {curiosity ? (
                <Text style={styles.curiosityText}>{curiosity}</Text>
              ) : null}
            </TouchableOpacity>
            {/* END:: Curiosidade */}

            {/* BEGIN:: Illustrador */}
            <TouchableOpacity
              style={[
                styles.illustrationButton,
                isPreviewMode && styles.previewMode,
                isPreviewMode && { left: 45 }
              ]}
              onPress={() => setIllustrationModalVisible(true)}
              disabled={isPreviewMode}
            >
              {illustration ? (
                <Text style={styles.illustrationText}>
                  Illus. {illustration}
                </Text>
              ) : null}
            </TouchableOpacity>
            {/* BEGIN:: Illustrador */}

            {/* BEGIN:: Licença */}
            <TouchableOpacity
              style={[
                styles.extraInfoButton,
                isPreviewMode && styles.previewMode
              ]}
              onPress={() => setExtraInfoModalVisible(true)}
              disabled={isPreviewMode}
            >
              {extraInfo ? (
                <Text style={styles.extraInfoText}>{extraInfo}</Text>
              ) : null}
            </TouchableOpacity>
            {/* END:: Licença */}

            {/* BEGIN:: Número da coleção */}
            <TouchableOpacity
              style={[
                styles.pokemonNumberButton,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setPokemonNumberModalVisible(true)}
              disabled={isPreviewMode}
            >
              {pokemonNumber ? (
                <Text style={styles.pokemonNumberText}>{pokemonNumber}</Text>
              ) : null}
            </TouchableOpacity>
            {/* BEGIN:: Número da coleção */}
          </View>
        </View>

        {/* Modal de Tipo */}
        <TypeModal
          visible={isTypeModalVisible}
          onClose={() => setTypeModalVisible(false)}
          onSelectType={(id) => {
            const template = TEMPLATES[id as keyof typeof TEMPLATES];
            updateCard({ currentTemplate: template });
            setTypeModalVisible(false);
          }}
        />

        {/* Modal de HP */}
        <HpModal
          visible={isHpModalVisible}
          onClose={() => setHpModalVisible(false)}
          onSave={(valor) => {
            updateCard({ hp: valor });
            setHpModalVisible(false);
          }}
        />

        {/* Modal de Nome */}
        <NameModal
          visible={isNameModalVisible}
          onClose={() => setNameModalVisible(false)}
          onSave={(valor) => {
            updateCard({ name: valor });
            setNameModalVisible(false);
          }}
        />

        {/* Modal de Descrição */}
        <DescriptionModal
          visible={isDescriptionModalVisible}
          onClose={() => setDescriptionModalVisible(false)}
          onSave={(valor) => {
            updateCard({ description: valor });
            setDescriptionModalVisible(false);
          }}
        />

        {/* Modal de Curiosidade */}
        <CuriosityModal
          visible={isCuriosityModalVisible}
          onClose={() => setCuriosityModalVisible(false)}
          onSave={(valor) => {
            updateCard({ curiosity: valor });
            setCuriosityModalVisible(false);
          }}
        />

        {/* Modal de Ilustrador */}
        <IllustrationModal
          visible={isIllustrationModalVisible}
          onClose={() => setIllustrationModalVisible(false)}
          onSave={(valor) => {
            updateCard({ illustration: valor });
            setIllustrationModalVisible(false);
          }}
        />

        {/* Modal do Level */}
        <LevelModal
          visible={isLevelModalVisible}
          onClose={() => setLevelModalVisible(false)}
          onSave={(valor) => {
            updateCard({ level: valor });
            setLevelModalVisible(false);
          }}
        />

        {/* Modal do Número do Pokémon */}
        <PokemonNumberModal
          visible={isPokemonNumberModalVisible}
          onClose={() => setPokemonNumberModalVisible(false)}
          onSave={(valor) => {
            updateCard({ pokemonNumber: valor });
            setPokemonNumberModalVisible(false);
          }}
        />

        {/* Modal de Informação Extra */}
        <ExtraInfoModal
          visible={isExtraInfoModalVisible}
          onClose={() => setExtraInfoModalVisible(false)}
          onSave={(valor) => {
            updateCard({ extraInfo: valor });
            setExtraInfoModalVisible(false);
          }}
        />

        {/* Modal de Fraqueza */}
        <WeaknessModal
          visible={isWeaknessModalVisible}
          onClose={() => setWeaknessModalVisible(false)}
          onSelectWeakness={(id) => {
            updateCard({ weakness: id });
            setWeaknessModalVisible(false);
          }}
        />

        {/* Modal de Segunda Fraqueza */}
        <WeaknessModal
          visible={isSecondWeaknessModalVisible}
          onClose={() => setSecondWeaknessModalVisible(false)}
          onSelectWeakness={(id) => {
            updateCard({ secondWeakness: id });
            setSecondWeaknessModalVisible(false);
          }}
        />

        {/* Modal de Resistência */}
        <ResistanceModal
          visible={isResistanceModalVisible}
          onClose={() => setResistanceModalVisible(false)}
          onSelectResistance={(id) => {
            updateCard({ resistance: id });
            setResistanceModalVisible(false);
          }}
        />

        {/* Modal de Segunda Resistência */}
        <ResistanceModal
          visible={isSecondResistanceModalVisible}
          onClose={() => setSecondResistanceModalVisible(false)}
          onSelectResistance={(id) => {
            updateCard({ secondResistance: id });
            setSecondResistanceModalVisible(false);
          }}
        />

        {/* Modal de Custo de Recuo */}
        <RetreatModal
          visible={isRetreatModalVisible}
          onClose={() => setRetreatModalVisible(false)}
          onSave={(symbol, count) => {
            updateCard({ retreat: { symbol, count } });
            setRetreatModalVisible(false);
          }}
        />

        {/* Modal de Valor da Fraqueza */}
        <WeaknessValueModal
          visible={isWeaknessValueModalVisible}
          onClose={() => setWeaknessValueModalVisible(false)}
          onSave={(value) => {
            updateCard({ weaknessValue: value });
            setWeaknessValueModalVisible(false);
          }}
        />

        {/* Modal de Valor da Resistência */}
        <ResistanceValueModal
          visible={isResistanceValueModalVisible}
          onClose={() => setResistanceValueModalVisible(false)}
          onSave={(value) => {
            updateCard({ resistanceValue: value });
            setResistanceValueModalVisible(false);
          }}
        />

        {/* Modal da Primeira Habilidade */}
        <SkillModal
          visible={isFirstSkillModalVisible}
          onClose={() => setFirstSkillModalVisible(false)}
          onSave={(skill) => {
            updateCard({ firstSkill: skill });
            setFirstSkillModalVisible(false);
          }}
          title="Primeira Habilidade"
        />

        {/* Modal de Habilidade Passiva */}
        <SkillModal
          visible={isPassiveSkillModalVisible}
          onClose={() => setPassiveSkillModalVisible(false)}
          onSave={(skill) => {
            updateCard({ passiveSkill: skill });
            setPassiveSkillModalVisible(false);
          }}
          title="Habilidade Passiva"
          isPassive={true}
          initialColor={passiveSkill?.color}
        />

        {/* Modal do Dano da Primeira Habilidade */}
        <SkillDamageModal
          visible={isFirstSkillDamageModalVisible}
          onClose={() => setFirstSkillDamageModalVisible(false)}
          onSave={(value) => {
            updateCard({ firstSkillDamage: value });
            setFirstSkillDamageModalVisible(false);
          }}
        />

        {/* Modal do Custo de Energia da Primeira Habilidade */}
        <SkillEnergyModal
          visible={isFirstSkillEnergyModalVisible}
          onClose={() => setFirstSkillEnergyModalVisible(false)}
          onSave={(symbol, count) => {
            updateCard({ firstSkillEnergy: { symbol, count } });
            setFirstSkillEnergyModalVisible(false);
          }}
        />

        {/* Modal da Segunda Habilidade */}
        <SkillModal
          visible={isSecondSkillModalVisible}
          onClose={() => setSecondSkillModalVisible(false)}
          onSave={(skill) => {
            updateCard({ secondSkill: skill });
            setSecondSkillModalVisible(false);
          }}
          title="Segunda Habilidade"
        />

        {/* Modal do Dano da Segunda Habilidade */}
        <SkillDamageModal
          visible={isSecondSkillDamageModalVisible}
          onClose={() => setSecondSkillDamageModalVisible(false)}
          onSave={(value) => {
            updateCard({ secondSkillDamage: value });
            setSecondSkillDamageModalVisible(false);
          }}
        />

        {/* Modal do Custo de Energia da Segunda Habilidade */}
        <SkillEnergyModal
          visible={isSecondSkillEnergyModalVisible}
          onClose={() => setSecondSkillEnergyModalVisible(false)}
          onSave={(symbol, count) => {
            updateCard({ secondSkillEnergy: { symbol, count } });
            setSecondSkillEnergyModalVisible(false);
          }}
        />

        {/* Modal de Menu */}
        <MenuModal
          visible={isMenuModalVisible}
          onClose={() => setMenuModalVisible(false)}
          movesCount={movesCount}
          onSelectMovesCount={(count) => {
            if (count === 2) {
              updateCard({ movesCount: count, hasPassiveSkill: false });
            } else {
              updateCard({ movesCount: count });
            }
          }}
          hasPassiveSkill={hasPassiveSkill}
          onSelectPassiveSkill={(hasPassive) => {
            if (hasPassive) {
              updateCard({ hasPassiveSkill: hasPassive, movesCount: 1 });
            } else {
              updateCard({ hasPassiveSkill: hasPassive });
            }
          }}
          weaknessesCount={weaknessesCount}
          onSelectWeaknessesCount={(count) => updateCard({ weaknessesCount: count })}
          resistancesCount={resistancesCount}
          onSelectResistancesCount={(count) => updateCard({ resistancesCount: count })}
        />

        {/* Modal de Descarte de Alterações */}
        <DiscardChangesModal
          visible={isDiscardModalVisible}
          onContinue={() => setDiscardModalVisible(false)}
          onDiscard={() => {
            setDiscardModalVisible(false);
            router.push("/pokemon");
          }}
        />

        {/* BEGIN:: Bottom bar */}
        <View style={styles.footerBar}>
          {/* Undo */}
          <TouchableOpacity
            onPress={undo}
            disabled={isPreviewMode || !canUndo}
            style={{ opacity: isPreviewMode || !canUndo ? 0.3 : 1 }}
          >
            <Image
              source={require("../../../assets/images/icons/arrow_left.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>

          {/* Save */}
          <TouchableOpacity
            onPress={handleSaveCard}
            style={{ opacity: 1 }}
          >
            <Image
              source={require("../../../assets/images/icons/save.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>

          {/* Preview */}
          <TouchableOpacity onPress={() => setIsPreviewMode(!isPreviewMode)}>
            <Image
              source={require("../../../assets/images/icons/eye.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>

          {/* Redo */}
          <TouchableOpacity
            onPress={redo}
            disabled={isPreviewMode || !canRedo}
            style={{ opacity: isPreviewMode || !canRedo ? 0.3 : 1 }}
          >
            <Image
              source={require("../../../assets/images/icons/arrow_right.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>

          {/* Menu */}
          <TouchableOpacity onPress={() => setMenuModalVisible(true)}>
            <Image
              source={require("../../../assets/images/icons/menu.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>
        </View>
        {/* END:: Bottom bar */}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: Spacing.three, // Removido o BottomTabInset para descer a barra
    maxWidth: MaxContentWidth,
  },
  // O wrapper invisível com o tamanho já reduzido matematicamente
  scaledWrapper: {
    width: CARD_REAL_WIDTH * cardScale,
    height: CARD_REAL_HEIGHT * cardScale,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  // Estilo adicionado no previewMode para sumir com bordas e fundos
  previewMode: {
    borderWidth: 0,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },

  // Bottom Bar / Footer
  footerBar: {
    width: "100%",
    height: 50,
    backgroundColor: "#7C3AED",
    marginTop: "auto", // Joga a barra lá para o final da tela
    borderRadius: 8, // Fica bonito já que tem os paddings da página
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around", // Prepara para receber múltiplos itens distribuídos
  },

  // Ícones do Footer
  footerIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },

  // A carta gigante que sofre o zoom-out visualmente
  realSizeCard: {
    width: CARD_REAL_WIDTH,
    height: CARD_REAL_HEIGHT,
    transform: [{ scale: cardScale }],
    position: "absolute", // Fundamental para a carta gigante não empurrar os botões da tela
  },

  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  typeButton: {
    position: "absolute",
    top: 59, // Alinhamento vertical
    right: 68, // Alinhamento horizontal
    width: 60, // Largura
    height: 60, // Altura
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },

  levelText: {
    fontFamily: "Revue",
    fontSize: 25,
    color: "#000",
    textAlign: "center",
    textShadowColor: "white",
    fontWeight: 'bold',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },

  levelButton: {
    position: "absolute",
    top: 90,
    right: 285, // Provisório (à esquerda da box de HP)
    width: 80, // Menor que o HP
    height: 30, // Menor que o HP
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  hpButton: {
    position: "absolute",
    top: 70, // Mesmo alinhamento vertical da bolinha
    right: 130,
    width: 150,
    height: 50, // Mesma altura
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "flex-start", // Centraliza o texto verticalmente
    alignItems: "flex-start", // Centraliza o texto horizontalmente
  },

  // Terceiro botão (Para o Nome do Pokémon, etc)
  nameButton: {
    position: "absolute",
    top: 70, // Mesmo alinhamento vertical da bolinha
    left: 80, // Fica à esquerda do botão de HP (135 da margem do hp + 100 da largura do hp + 10 de espaço)
    width: 250, // Bem mais largo por ser um retângulo gigante (ajuste se precisar)
    height: 50, // Mesma altura
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "flex-start", // Alinha o nome pela esquerda
  },

  // Sexto botão (Imagem, acima da descrição que você vai posicionar)
  imageButton: {
    position: "absolute",
    top: 134, // Valor provisório
    left: 92, // Valor provisório
    width: 560, // Valor provisório
    height: 387, // Valor provisório (caixa grande para a arte)
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Para a imagem não vazar das bordas redondas
  },

  pokemonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imageButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Quarto botão (Extra, do lado do Nome)
  descriptionButton: {
    position: "absolute",
    top: 549,
    left: 105, // O nameButton vai de 80 a 330 (80+250). Com 10 de espaço, começamos no 340.
    width: 535,
    height: 35,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center", // Para o texto da descrição ficar centralizado verticalmente
    alignItems: "center", // E horizontalmente
  },

  // Custo de Energia da Primeira Habilidade
  firstSkillEnergyButton: {
    position: "absolute",
    top: 610, // Mesma altura da habilidade (provisório)
    left: 45, // Provisório (à esquerda da habilidade que está em 135)
    width: 85, // Provisório
    height: 100, // Mesma altura inicial (provisório)
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  skillEnergyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    gap: 2,
    width: "100%",
  },

  skillEnergyIcon: {
    width: 37,
    height: 37,
    resizeMode: "contain",
  },

  // Primeira Habilidade (Abaixo da descrição)
  firstSkillButton: {
    position: "absolute",
    top: 610, // Valor provisório (abaixo da descrição)
    left: 135, // Mesmo alinhamento da descrição
    width: 490, // Mesma largura da descrição
    height: 100, // Mesma altura da descrição
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "flex-start", // Puxa o texto para o topo removendo o espaço vazio
    alignItems: "flex-start", // Puxa o texto para a esquerda
    paddingHorizontal: 5, // Apenas para não encostar literalmente na linha da borda
    paddingTop: 0, // Garante que comece do topo exato
  },

  passiveSkillButton: {
    position: "absolute",
    top: 595, // Mesma altura que a primeira habilidade
    left: 135,
    width: 490,
    height: 125,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 5,
    paddingTop: 0,
  },

  // Habilidade Única (Nome e Descrição)
  singleSkillButton: {
    position: "absolute",
    top: 650, // Meio do caminho
    left: 135,
    width: 490,
    height: 145,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },

  // Dano da Primeira Habilidade (Ao lado direito)
  firstSkillDamageButton: {
    position: "absolute",
    top: 610, // Mesma altura da habilidade
    left: 630, // Valor provisório (à direita da habilidade)
    width: 70, // Valor provisório
    height: 100, // Mesma altura da habilidade
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // --- SEGUNDA HABILIDADE ---

  // Custo de Energia da Segunda Habilidade
  secondSkillEnergyButton: {
    position: "absolute",
    top: 730, // Provisório (logo abaixo da primeira habilidade)
    left: 45,
    width: 85,
    height: 100,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Segunda Habilidade
  secondSkillButton: {
    position: "absolute",
    top: 730, // Provisório
    left: 135,
    width: 490,
    height: 100,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 5,
    paddingTop: 0,
  },

  // Dano da Segunda Habilidade
  secondSkillDamageButton: {
    position: "absolute",
    top: 730, // Provisório
    left: 630,
    width: 70,
    height: 100,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Décimo botão (Fraqueza, Abaixo da descrição)
  weaknessButton: {
    position: "absolute",
    top: 862.5, // Ajustei -2.5px para o centro do botão continuar no mesmo lugar!
    left: 107.5,
    width: 45, // Tamanho que você queria no modo edição
    height: 45,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Segunda Fraqueza (Esquerda da principal)
  secondWeaknessButton: {
    position: "absolute",
    top: 862.5,
    left: 137,
    width: 45,
    height: 45,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Botão de Valor da Fraqueza (Ao lado da fraqueza)
  weaknessValueButton: {
    position: "absolute",
    top: 862.5,
    left: 155,
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Décimo primeiro botão (Ao lado da fraqueza)
  resistanceButton: {
    position: "absolute",
    top: 862.5, // Mesmo alinhamento vertical
    left: 338, // Valor provisório (à direita da fraqueza)
    width: 45,
    height: 45,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Segunda Resistência (Esquerda da principal)
  secondResistanceButton: {
    position: "absolute",
    top: 862.5,
    left: 364,
    width: 45,
    height: 45,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Botão de Valor da Resistência
  resistanceValueButton: {
    position: "absolute",
    top: 862.5,
    left: 385, // Valor provisório
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Décimo segundo botão (Custo de Recuo)
  retreatButton: {
    position: "absolute",
    top: 862.5, // Mesmo alinhamento vertical
    right: 80, // Valor provisório
    width: 130,
    height: 45,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  weaknessIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  resistanceIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  retreatIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  // Quinto botão (Curiosidade, que você vai posicionar depois)
  curiosityButton: {
    position: "absolute",
    top: 912, // Valor provisório
    left: 81, // Valor provisório
    width: 581.5, // Valor provisório
    height: 64, // Valor provisório
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Sétimo botão (Ilustrador, abaixo da curiosidade que você vai posicionar)
  illustrationButton: {
    position: "absolute",
    top: 980, // Valor provisório
    left: 40, // Valor provisório
    width: 150, // Valor provisório
    height: 25, // Valor provisório
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  // Oitavo botão (Número do Pokémon, à direita do ilustrador)
  pokemonNumberButton: {
    position: "absolute",
    top: 980, // Mesmo alinhamento vertical do ilustrador
    right: 40, // Provisório (jogando um pouco mais pra direita)
    width: 50, // Mesma largura
    height: 25, // Mesma altura
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Nono botão (Extra Info, centralizado horizontalmente na carta)
  extraInfoButton: {
    position: "absolute",
    top: 980, // Mesmo alinhamento vertical
    left: 193, // MÁGICA: Isso centraliza automaticamente, não importa a largura!
    width: 458, // Pode mudar a largura à vontade agora
    height: 25, // Mesma altura do ilustrador
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center", // Puxa para o topo
    alignItems: "center", // Puxa para a esquerda
    padding: 0, // Sem padding extra, texto encosta nas bordas
  },

  // Texto do HP (Usando a fonte personalizada)
  hpText: {
    // fontFamily: "Futura-Heavy",
    fontFamily: "GillSans-Bold",
    fontSize: 45,
    color: "#000", // HP geralmente é preto ou bem escuro
    textAlign: "left",
    // Um pouco de sombra para dar leitura melhor
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Texto do Nome
  nameText: {
    fontFamily: "GillSans-Bold",
    fontSize: 45,
    color: "#000",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Texto da Descrição (Sem itálico ou bold forçado, apenas a fonte normal)
  descriptionText: {
    fontFamily: "GillSans-Bold-Italic",
    fontSize: 23,
    color: "#000",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Nome da Habilidade (Bold)
  skillNameText: {
    fontFamily: "GillSans-Bold",
    fontSize: 35,
    color: "#000",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },

  // Dano da Habilidade (Bold e Grande)
  skillDamageText: {
    fontFamily: "GillSans-Bold",
    fontSize: 45,
    color: "#000",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },

  // Descrição da Habilidade (Regular)
  skillDescriptionText: {
    fontFamily: "GillSans",
    fontSize: 23,
    color: "#000",
    textAlign: "left", // Geralmente o texto das habilidades começa alinhado à esquerda
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false, // Remove padding extra nativo da fonte no Android
  },

  // Texto da Curiosidade (Mesma fonte e tamanho da descrição)
  curiosityText: {
    fontFamily: "GillSans",
    fontSize: 23,
    color: "#000",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  weaknessValueText: {
    fontFamily: "GillSans",
    fontSize: 25,
    color: "#000",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  resistanceValueText: {
    fontFamily: "GillSans",
    fontSize: 25,
    color: "#000",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Texto do Ilustrador
  illustrationText: {
    fontFamily: "GillSans-Bold",
    fontSize: 16,
    color: "#000",
    textAlign: "left",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Texto do Número do Pokémon
  pokemonNumberText: {
    fontFamily: "GillSans",
    fontSize: 16,
    color: "#000",
    textAlign: "left",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Texto da Informação Extra
  extraInfoText: {
    fontFamily: "GillSans",
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false, // Remove padding nativo da fonte no Android
  },
});
