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
import { TYPE_ICONS } from "@/constants/type_icons";
import { CARD_TEMPLATES } from "@/constants/card_templates";

import { Back } from "@/components/back";
import { TypeModal } from "@/components/modals/type_modal";
import { HpModal } from "@/components/modals/hp_modal";
import { NameModal } from "@/components/modals/name_modal";
import { DescriptionModal } from "@/components/modals/description_modal";
import { CuriosityModal } from "@/components/modals/curiosity_modal";
import { IllustrationModal } from "@/components/modals/illustration_modal";
import { PokemonNumberModal } from "@/components/modals/pokemon_number_modal";
import { RarityModal } from "@/components/modals/rarity_modal";
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
import { ResponsiveText } from "@/components/responsive-text";
import { useRouter } from "expo-router";

type CardState = {
  currentTemplate: string; // id do template em CARD_TEMPLATES
  pokemonImage: string | null;
  hp: string;
  name: string;
  description: string;
  curiosity: string;
  illustration: string;
  pokemonNumber: string;
  rarity: string | null;
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
  firstSkillEnergy: string[] | null;
  secondSkill: { name: string; description: string } | null;
  secondSkillDamage: string;
  secondSkillEnergy: string[] | null;
};

const initialState: CardState = {
  currentTemplate: "normal",
  pokemonImage: null,
  hp: "",
  name: "",
  description: "",
  curiosity: "",
  illustration: "",
  pokemonNumber: "",
  rarity: null,
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

// Mapeamento dos símbolos de raridade (os de tipagem vêm de @/constants/type_icons)
const RARITY_ICONS: Record<string, any> = {
  common: require('../../../assets/images/icons/rarities/common.png'),
  uncommon: require('../../../assets/images/icons/rarities/uncommon.png'),
  rare: require('../../../assets/images/icons/rarities/rare.png'),
  promo: require('../../../assets/images/icons/rarities/promo.png'),
};

// Templates que recebem o estilo único hpButtonCustom (definido em styles)
const BUTTON_CUSTOM_TEMPLATES = [
  "bug", "dragon", "earth", "fairy", "flying", "ghost", "ice", "poison", "rock"
];

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
  const [isRarityModalVisible, setRarityModalVisible] = useState<boolean>(false);
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
    illustration, pokemonNumber, rarity, extraInfo, weakness, secondWeakness,
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
            <Image source={CARD_TEMPLATES[currentTemplate]} style={styles.cardImage} />

            {/* ========= BEGIN:: Nome ========= */}
            <TouchableOpacity
              style={[
                styles.nameButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.nameButtonCustom,
                isPreviewMode && styles.previewMode
              ]}
              onPress={() => setNameModalVisible(true)}
              disabled={isPreviewMode}
            >
              {name ?
                <ResponsiveText
                  style={[
                    styles.nameText,
                    BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.nameTextCustom,
                  ]}
                >{name}</ResponsiveText>
              : null }
            </TouchableOpacity>
            {/* ========= END:: Nome ========= */}

            {/* ========= BEGIN:: Level ========= */}
            <TouchableOpacity
              style={[
                styles.levelButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.levelButtonCustom,
                isPreviewMode && styles.previewMode,
                {
                  right: BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate)
                    ? (hp.length > 2 ? 265 : 240)
                    : (hp.length > 2 ? 285 : 260)
                }
              ]}
              onPress={() => setLevelModalVisible(true)}
              disabled={isPreviewMode}
            >
              {level ? <ResponsiveText style={styles.levelText}>Nv.{level}</ResponsiveText> : null}
            </TouchableOpacity>
            {/* ========= END:: Level ========= */}

            {/* ========= BEGIN:: HP ========= */}
            <TouchableOpacity
              style={[
                styles.hpButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.hpButtonCustom,
                isPreviewMode && styles.previewMode,
                { width: hp.length > 2 ? 150 : 125 }
              ]}
              onPress={() => setHpModalVisible(true)}
              disabled={isPreviewMode}
            >
              {hp ? <ResponsiveText style={styles.hpText}>{hp} HP</ResponsiveText> : null}
            </TouchableOpacity>
            {/* ========= END:: HP ========= */}

            {/* ========= BEGIN:: Tipo ========= */}
            <TouchableOpacity
              style={[
                styles.typeButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.typeButtonCustom,
                isPreviewMode && styles.previewMode
              ]}
              onPress={() => setTypeModalVisible(true)}
              disabled={isPreviewMode}
            />
            {/* ========= END:: Tipo ========= */}

            {/* ========= BEGIN:: Imagem ========= */}
            <TouchableOpacity
              style={[
                styles.imageButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.imageButtonCustom,
                isPreviewMode && styles.previewMode
              ]}
              onPress={pickImage}
              disabled={isPreviewMode}
            >
              {pokemonImage
                ? <Image source={{ uri: pokemonImage }} style={styles.pokemonImage} />
                : !isPreviewMode && (
                  <ResponsiveText style={[
                    styles.imageButtonText,
                    BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.imageButtonTextCustom
                  ]}>
                    Clique aqui para{"\n"}adicionar uma imagem
                  </ResponsiveText>
                )
              }
            </TouchableOpacity>
            {/* ========= END:: Imagem ========= */}

            {/* ========= BEGIN: Descrição ========= */}
            <TouchableOpacity
              style={[
                styles.descriptionButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.descriptionButtonCustom,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setDescriptionModalVisible(true)}
              disabled={isPreviewMode}
            >
              {description ? (
                <ResponsiveText style={styles.descriptionText}>{description}</ResponsiveText>
              ) : null}
            </TouchableOpacity>
            {/* ========= END: Descrição ========= */}

            {/* ========= BEGIN:: Habilidade ========= */}
            {hasPassiveSkill && (
              <TouchableOpacity
                style={[
                  styles.passiveSkillButton,
                  isPreviewMode && styles.previewMode
                ]}
                onPress={() => setPassiveSkillModalVisible(true)}
                disabled={isPreviewMode}
              >
                {passiveSkill ? (
                  <ResponsiveText style={[styles.skillDescriptionText, { width: '100%' }]}>
                    <ResponsiveText style={[styles.skillNameText, { color: passiveSkill.color || '#CC0000', fontSize: 25 }]}>
                      Poder Pokémon: <ResponsiveText style={{ color: passiveSkill.color }}>{passiveSkill.name} </ResponsiveText>
                    </ResponsiveText>
                    {passiveSkill.description}
                  </ResponsiveText>
                ) : null}
              </TouchableOpacity>
            )}
            {/* ========= END:: Habilidade ========= */}

            {/* ========= BEGIN:: Movimento 1 ========= */}
            {movesCount === 2 && (
              <>
                {/* ========= BEGIN:: Custo ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillEnergyButton,
                    isPreviewMode && styles.previewMode,
                    isPreviewMode && firstSkillEnergy && firstSkillEnergy.length >= 3 && { top: 605 },
                  ]}
                  onPress={() => setFirstSkillEnergyModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkillEnergy && firstSkillEnergy.length > 0 ? (
                    <View style={styles.skillEnergyContainer}>
                      {firstSkillEnergy.map((symbol, index) => (
                        <Image
                          key={index}
                          source={TYPE_ICONS[symbol]}
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
                    isPreviewMode && styles.previewMode
                  ]}
                  onPress={() => setFirstSkillModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkill ? (
                    <ResponsiveText style={styles.skillDescriptionText}>
                      <ResponsiveText style={styles.skillNameText}>{firstSkill.name} </ResponsiveText>
                      {firstSkill.description}
                    </ResponsiveText>
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
                    <ResponsiveText style={[styles.skillDamageText, firstSkillDamage.includes('+') && { fontSize: 30 }]}>{firstSkillDamage}</ResponsiveText>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Qtd. de Dano ========= */}
              </>
            )}
            {/* ========= END:: Movimento 1 ========= */}

            {/* ========= BEGIN:: Separador ========= */}
            {(movesCount === 2 || (movesCount === 1 && hasPassiveSkill)) && (
              <View style={[styles.movesSeparatorLine, currentTemplate === "dark" &&{ backgroundColor: 'white' }]} />
            )}
            {/* ========= END:: Separador ========= */}

            {/* ========= BEGIN:: Movimento 2 ========= */}
            {(movesCount === 2 || (movesCount === 1 && hasPassiveSkill)) && (
              <>
                {/* ========= BEGIN:: Custo ========= */}
                <TouchableOpacity
                  style={[
                    styles.secondSkillEnergyButton,
                    isPreviewMode && styles.previewMode,
                    isPreviewMode && secondSkillEnergy && secondSkillEnergy.length >= 3 && { top: 725 },
                  ]}
                  onPress={() => setSecondSkillEnergyModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {secondSkillEnergy && secondSkillEnergy.length > 0 ? (
                    <View style={styles.skillEnergyContainer}>
                      {secondSkillEnergy.map((symbol, index) => (
                        <Image
                          key={index}
                          source={TYPE_ICONS[symbol]}
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
                    isPreviewMode && styles.previewMode
                  ]}
                  onPress={() => setSecondSkillModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {secondSkill ? (
                    <ResponsiveText style={styles.skillDescriptionText}>
                      <ResponsiveText style={styles.skillNameText}>{secondSkill.name} </ResponsiveText>
                      {secondSkill.description}
                    </ResponsiveText>
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
                    <ResponsiveText style={[styles.skillDamageText, secondSkillDamage.includes('+') && { fontSize: 30 }]}>{secondSkillDamage}</ResponsiveText>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Qtd. de Dano ========= */}
              </>
            )}
            {/* ========= END:: Movimento 2 ========= */}

            {/* ========= END:: Movimento unico ========= */}
            {movesCount === 1 && !hasPassiveSkill && (
              <>
                {/* ========= BEGIN:: Custo ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillEnergyButton,
                    isPreviewMode && styles.previewMode,
                    { top: 650, height: 100 }
                  ]}
                  onPress={() => setFirstSkillEnergyModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkillEnergy && firstSkillEnergy.length > 0 ? (
                    <View style={styles.skillEnergyContainer}>
                      {firstSkillEnergy.map((symbol, index) => (
                        <Image
                          key={index}
                          source={TYPE_ICONS[symbol]}
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
                      <ResponsiveText
                        style={[
                          styles.skillNameText,
                          { fontSize: 35, textAlign: 'center' }
                        ]}
                      >{firstSkill.name}</ResponsiveText>

                      {firstSkill.description ? (
                        <ResponsiveText
                          style={[
                            styles.skillDescriptionText,
                            { fontSize: 23, textAlign: 'left', marginTop: 5 }
                          ]}
                        >{firstSkill.description}</ResponsiveText>
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
                    { top: 650, height: 100 } // Valores provisórios centralizados
                  ]}
                  onPress={() => setFirstSkillDamageModalVisible(true)}
                  disabled={isPreviewMode}
                >
                  {firstSkillDamage ? (
                    <ResponsiveText style={[styles.skillDamageText, firstSkillDamage.includes('+') && { fontSize: 30 }]}>{firstSkillDamage}</ResponsiveText>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Qtd. de Dano ========= */}
              </>
            )}
            {/* ========= END:: Movimento unico ========= */}

            {/* ========= BEGIN:: Fraquezas ========= */}
            {/* ========= BEGIN:: Fraqueza 1 ========= */}
            <TouchableOpacity
              style={[
                styles.weaknessButton,
                weaknessesCount === 2 && { left: 89 },
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.weaknessButtonCustom,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && weaknessesCount === 2 && { left: 79 },
                isPreviewMode && styles.previewMode,
                isPreviewMode && {
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
                  BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.secondWeaknessButtonCustom,
                  isPreviewMode && styles.previewMode,
                  isPreviewMode && {
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
                weaknessesCount === 2 && { left: 184 },
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.weaknessValueButtonCustom,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && weaknessesCount === 2 && { left: 167 },
                isPreviewMode && styles.previewMode,
                isPreviewMode && { left: weaknessesCount === 2 ? 180 : 155 }, // Ajuste para modo preview
              ]}
              onPress={() => setWeaknessValueModalVisible(true)}
              disabled={isPreviewMode}
            >
              {weaknessValue ? (
                <ResponsiveText style={styles.weaknessValueText}>{weaknessValue}</ResponsiveText>
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
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.resistanceButtonCustom,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && resistancesCount === 2 && { left: 319 },
                isPreviewMode && styles.previewMode,
                isPreviewMode && {
                  left: resistancesCount === 2 ? 318 : 338
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
                  BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.secondResistanceButtonCustom,
                  isPreviewMode && styles.previewMode,
                  isPreviewMode && {
                    left: 363
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
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.resistanceValueButtonCustom,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && resistancesCount === 2 && { left: 407 },
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setResistanceValueModalVisible(true)}
              disabled={isPreviewMode}
            >
              {resistanceValue ? (
                <ResponsiveText style={styles.resistanceValueText}>{resistanceValue}</ResponsiveText>
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Valor das resistências ========= */}
            {/* ========= END:: Resistências ========= */}

            {/* ========= BEGIN:: Custo de retirada ========= */}
            <TouchableOpacity
              style={[
                styles.retreatButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.retreatButtonCustom,
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
            {/* ========= END:: Custo de retirada ========= */}

            {/* ========= BEGIN:: Curiosidade ========= */}
            <TouchableOpacity
              style={[
                styles.curiosityButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.curiosityButtonCustom,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setCuriosityModalVisible(true)}
              disabled={isPreviewMode}
            >
              {curiosity ? (
                <ResponsiveText style={styles.curiosityText}>{curiosity}</ResponsiveText>
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Curiosidade ========= */}

            {/* ========= BEGIN:: Illustrador ========= */}
            <TouchableOpacity
              style={[
                styles.illustrationButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.illustrationButtonCustom,
                isPreviewMode && styles.previewMode,
                isPreviewMode && { left: 45 }
              ]}
              onPress={() => setIllustrationModalVisible(true)}
              disabled={isPreviewMode}
            >
              {illustration ? (
                <ResponsiveText style={styles.illustrationText}>
                  Illus. {illustration}
                </ResponsiveText>
              ) : null}
            </TouchableOpacity>
            {/* ========= BEGIN:: Illustrador ========= */}

            {/* ========= BEGIN:: Licença ========= */}
            <TouchableOpacity
              style={[
                styles.extraInfoButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.extraInfoButtonCustom,
                isPreviewMode && styles.previewMode
              ]}
              onPress={() => setExtraInfoModalVisible(true)}
              disabled={isPreviewMode}
            >
              {extraInfo ? (
                <ResponsiveText style={styles.extraInfoText}>{extraInfo}</ResponsiveText>
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Licença ========= */}

            {/* ========= BEGIN:: Número da coleção ========= */}
            <TouchableOpacity
              style={[
                styles.pokemonNumberButton,
                BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.pokemonNumberButtonCustom,
                isPreviewMode && styles.previewMode
              ]}
              onPress={() => setPokemonNumberModalVisible(true)}
              disabled={isPreviewMode}
            >
              {pokemonNumber ? (
                <ResponsiveText style={styles.pokemonNumberText}>{pokemonNumber}</ResponsiveText>
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Número da coleção ========= */}

            {/* ========= BEGIN:: Raridade ========= */}
            <TouchableOpacity
                style={[
                  styles.rarityButton,
                  BUTTON_CUSTOM_TEMPLATES.includes(currentTemplate) && styles.rarityButtonCustom,
                  isPreviewMode && styles.previewMode
                ]}
                onPress={() => setRarityModalVisible(true)}
                disabled={isPreviewMode}
              >
                {rarity ? (
                  <Image
                    source={RARITY_ICONS[rarity]}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain'
                    }}
                  />
                ) : null}
              </TouchableOpacity>
            {/* ========= END:: Raridade ========= */}
          </View>
        </View>

        {/* Modal de Tipo */}
        <TypeModal
          visible={isTypeModalVisible}
          onClose={() => setTypeModalVisible(false)}
          onSelectType={(id) => {
            updateCard({ currentTemplate: id });
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

        {/* Modal de Raridade */}
        <RarityModal
          visible={isRarityModalVisible}
          onClose={() => setRarityModalVisible(false)}
          onSelectRarity={(id) => {
            updateCard({ rarity: id });
            setRarityModalVisible(false);
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

        {/* Modal do primeiro movimento */}
        <SkillModal
          visible={isFirstSkillModalVisible}
          onClose={() => setFirstSkillModalVisible(false)}
          onSave={(skill) => {
            updateCard({ firstSkill: skill });
            setFirstSkillModalVisible(false);
          }}
          title="1º Movimento"
        />

        {/* Modal da Segunda Habilidade */}
        <SkillModal
          visible={isSecondSkillModalVisible}
          onClose={() => setSecondSkillModalVisible(false)}
          onSave={(skill) => {
            updateCard({ secondSkill: skill });
            setSecondSkillModalVisible(false);
          }}
          title="2º Movimento"
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
          inputPlaceholder="Ex: Troca de Dano"
          inputPlaceholder2="Ex: No seu turno e o quanto desejar, você pode mover 1 marcador de dano de um dos seus Pokémons para um outro (também seu)..."
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
          initialEnergies={firstSkillEnergy || []}
          onSave={(energies) => {
            updateCard({ firstSkillEnergy: energies.length > 0 ? energies : null });
            setFirstSkillEnergyModalVisible(false);
          }}
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
          initialEnergies={secondSkillEnergy || []}
          onSave={(energies) => {
            updateCard({ secondSkillEnergy: energies.length > 0 ? energies : null });
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

        {/* ========= BEGIN:: Footer bar ========= */}
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
          <TouchableOpacity
            onPress={() => setMenuModalVisible(true)}
            disabled={isPreviewMode}
            style={{ opacity: isPreviewMode ? 0.3 : 1 }}
          >
            <Image
              source={require("../../../assets/images/icons/menu.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>
        </View>
        {/* ========= END:: Footer bar ========= */}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // ========= BEGIN:: Main Content =========
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
  scaledWrapper: {
    width: CARD_REAL_WIDTH * cardScale,
    height: CARD_REAL_HEIGHT * cardScale,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  // ========= END:: Main Content =========

  // ========= BEGIN:: Footer bar =========
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
  footerIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  // ========= END:: Footer bar =========

  previewMode: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
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
  movesSeparatorLine: {
    position: 'absolute',
    top: 720,
    left: 60,
    width: 615,
    height: 2,
    backgroundColor: 'black',
  },

  // ========= BEGIN:: Nome =========
  nameButton: {
    position: "absolute",
    top: 70,
    left: 80,
    width: 250,
    height: 50,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  nameButtonCustom: {
    top: 75,
    left: 70,
    height: 41,
  },
  nameText: {
    fontFamily: "GillSans-Bold",
    fontSize: 45,
    color: "#000",
  },
  nameTextCustom: {
    fontSize: 35,
  },
  // ========= END:: Nome =========

  // ========= BEGIN:: Level =========
  levelButton: {
    position: "absolute",
    top: 85,
    right: 285,
    width: 80,
    height: 30,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  // O right do level é definido no próprio botão (depende do HP); aqui vão os demais ajustes
  levelButtonCustom: {
    right: 265,
  },
  levelText: {
    fontFamily: "Revue",
    fontSize: 23,
    color: "#000",
    textAlign: "center",
    fontWeight: 'bold',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },
  // ========= END:: Level =========

  // ========= BEGIN:: HP =========
  hpButton: {
    position: "absolute",
    top: 69, // Mesmo alinhamento vertical da bolinha
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
  // Estilo único dos templates listados em BUTTON_CUSTOM_TEMPLATES
  hpButtonCustom: {
    top: 67,
    right: 111,
  },
  hpText: {
    fontFamily: "Futura-Heavy",
    fontSize: 41,
    color: "#000", // HP geralmente é preto ou bem escuro
    textAlign: "left",
  },
  // ========= END:: HP =========

  // ========= BEGIN:: Tipo =========
  typeButton: {
    position: "absolute",
    top: 59,
    right: 68,
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  typeButtonCustom: {
    top: 57,
    right: 49,
  },
  // ========= END:: Tipo =========

  // ========= BEGIN:: Imagem =========
  imageButton: {
    position: "absolute",
    top: 134,
    left: 92,
    width: 560,
    height: 387,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Para a imagem não vazar das bordas redondas
  },
  imageButtonCustom: {
    top: 131,
    left: 85,
    width: 575,
    height: 400,
    borderColor: "black",
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
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imageButtonTextCustom: {
    color: "#000",
  },
  // ========= END:: Imagem =========

  // ========= BEGIN: Descrição =========
  descriptionButton: {
    position: "absolute",
    top: 549,
    left: 105,
    width: 534,
    height: 35,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionButtonCustom: {
    top: 557,
    left: 98,
    width: 548,
  },
  descriptionText: {
    fontFamily: "GillSans-Bold-Italic",
    fontSize: 21,
    color: "#000",
    textAlign: "center",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // ========= END: Descrição =========

  // ========= BEGIN:: Habilidade =========
  passiveSkillButton: {
    position: "absolute",
    top: 590, // Mesma altura que a primeira habilidade
    left: 105,
    width: 535,
    height: 120,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: 'center',
    alignItems: "flex-start",
    paddingHorizontal: 5,
    paddingTop: 0,
  },
  // ========= END:: Habilidade =========

  // ========= BEGIN:: Movimento 1 =========
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
    justifyContent: 'center',
    alignItems: "flex-start", // Puxa o texto para a esquerda
    paddingHorizontal: 5, // Apenas para não encostar literalmente na linha da borda
    paddingTop: 0, // Garante que comece do topo exato
  },
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
  // ========= END:: Movimento 1 =========

  // ========= BEGIN:: Movimento 2 =========
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
    justifyContent: 'center',
    alignItems: "flex-start",
    paddingHorizontal: 5,
    paddingTop: 0,
  },
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
  // ========= END:: Movimento 2 =========

  // ========= BEGIN:: Movimento único =========
  singleSkillButton: {
    position: "absolute",
    top: 630, // Meio do caminho
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
  // ========= END:: Movimento único =========

  // ========= BEGIN:: Fraquezas =========
  weaknessButton: {
    position: "absolute",
    top: 862.5,
    left: 110,
    width: 45,
    height: 45,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  weaknessButtonCustom: {
    top: 873,
    left: 100,
    width: 41,
    height: 41,
  },
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
  secondWeaknessButtonCustom: {
    top: 873,
    left: 123,
    width: 41,
    height: 41,
  },
  weaknessValueButton: {
    position: "absolute",
    top: 862.5,
    left: 157,
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  weaknessValueButtonCustom: {
    top: 873,
    left: 143,
    width: 35,
    height: 35,
  },
  weaknessValueText: {
    fontFamily: "GillSans",
    fontSize: 23,
    color: "#000",
    textAlign: "center",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  weaknessIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  // ========= END:: Fraquezas =========

  // ========= BEGIN:: Resistências =========
  resistanceButton: {
    position: "absolute",
    top: 862.5,
    left: 338,
    width: 45,
    height: 45,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  resistanceButtonCustom: {
    top: 873,
    width: 41,
    height: 41,
  },
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
  secondResistanceButtonCustom: {
    top: 873,
    left: 363,
    width: 41,
    height: 41,
  },
  resistanceValueButton: {
    position: "absolute",
    top: 862.5,
    left: 385,
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  resistanceValueButtonCustom: {
    top: 873,
    left: 382,
    width: 35,
    height: 35,
  },
  resistanceValueText: {
    fontFamily: "GillSans",
    fontSize: 23,
    color: "#000",
    textAlign: "center",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resistanceIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  // ========= END:: Resistências =========

  // ========= BEGIN:: Custo de retirada =========
  retreatButton: {
    position: "absolute",
    top: 862.5,
    right: 80,
    width: 130,
    height: 45,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  retreatButtonCustom: {
    top: 875.5,
    height: 39,
  },
  retreatIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  // ========= END:: Custo de retirada =========

  // ========= BEGIN:: Curiosidade =========
  curiosityButton: {
    position: "absolute",
    top: 912,
    left: 81,
    width: 581.5,
    height: 64,
    borderWidth: 3,
    borderColor: "white",
    paddingLeft: 1,
    paddingRight: 1,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  curiosityButtonCustom: {
    top: 917,
    left: 71,
    width: 611,
    height: 57,
  },
  curiosityText: {
    fontFamily: "GillSans-Bold-Italic",
    fontSize: 17,
    color: "#000",
    textAlign: "center",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // ========= END:: Curiosidade =========

  // ========= BEGIN:: Illustrador =========
  illustrationButton: {
    position: "absolute",
    top: 980,
    left: 40,
    width: 141,
    height: 25,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  illustrationButtonCustom: {
    left: 32,
    top: 977,
  },
  illustrationText: {
    fontFamily: "GillSans-Bold",
    fontSize: 14,
    color: "#000",
    textAlign: "left",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // ========= END:: Illustrador =========

  // ========= BEGIN:: Licença =========
  extraInfoButton: {
    position: "absolute",
    top: 980, // Mesmo alinhamento vertical
    left: 184, // MÁGICA: Isso centraliza automaticamente, não importa a largura!
    width: 432, // Pode mudar a largura à vontade agora
    height: 25, // Mesma altura do ilustrador
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center", // Puxa para o topo
    alignItems: "center", // Puxa para a esquerda
    padding: 0, // Sem padding extra, texto encosta nas bordas
  },
  extraInfoButtonCustom: {
    top: 977,
  },
  extraInfoText: {
    fontFamily: "GillSans",
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false, // Remove padding nativo da fonte no Android
  },
  // ========= END:: Licença =========

  // ========= BEGIN:: Número da coleção =========
  pokemonNumberButton: {
    position: "absolute",
    top: 980,
    right: 70,
    width: 55,
    height: 25,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  pokemonNumberButtonCustom: {
    top: 977,
    right: 63,
  },
  pokemonNumberText: {
    fontFamily: "GillSans",
    fontSize: 16,
    color: "#000",
    textAlign: "left",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // ========= END:: Número da coleção =========

  // ========= BEGIN:: Raridade =========
  rarityButton: {
    position: "absolute",
    top: 980,
    right: 40,
    width: 30,
    height: 25,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  rarityButtonCustom: {
    top: 977,
    right: 31,
  },
  // ========= END:: Raridade =========

  // ========= BEGIN:: Utilitários =========
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
  skillNameText: {
    fontFamily: "GillSans-Bold",
    fontSize: 32,
    color: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },
  skillDescriptionText: {
    fontFamily: "GillSans",
    fontSize: 20,
    color: "#000",
    textAlign: "left",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },
  skillDamageText: {
    fontFamily: "Futura-Heavy",
    fontSize: 34,
    color: "#000",
    textAlign: "center",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },
  // ========= END:: Utilitários =========
});



