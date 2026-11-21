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
import Svg, { ClipPath, Defs, Image as SvgImage, Path } from "react-native-svg";

import { ThemedView } from "@/components/themed-view";
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { TYPE_ICONS } from "@/constants/type_icons";
import { BUTTON_CUSTOM_TEMPLATES, CARD_TEMPLATES, CardStage, TEXT_CUSTOM_TEMPLATES } from "@/constants/card_templates";
import { STAGE_IMAGE_OUTLINES, OutlinePoint, outlineToPath, outlineBox } from "@/constants/stage_image_outlines";

import { Back } from "@/components/back";
import { TypeModal } from "@/components/modals/type_modal";
import { HpModal } from "@/components/modals/hp_modal";
import { NameModal } from "@/components/modals/name_modal";
import { PreEvolutionNameModal } from "@/components/modals/pre_evolution_name_modal";
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
  currentTemplate: string; // id do template em CARD_TEMPLATES[currentStage]
  currentStage: CardStage;
  pokemonImage: string | null;
  collectionSymbol: string | null;
  preEvolutionImage: string | null;
  preEvolutionName?: string;
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
  descriptionSpacing: Partial<Record<MoveBox, DescriptionSpacing>>; // box sem ajuste = estilo padrão
};

const initialState: CardState = {
  currentTemplate: "normal",
  currentStage: "basic",
  pokemonImage: null,
  collectionSymbol: null,
  preEvolutionImage: null,
  preEvolutionName: "",
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
  descriptionSpacing: {},
};

// Boxes que continuam visíveis (e podem ser selecionadas) no modo editor de descrição de movimento
type MoveBox = "passive" | "move1" | "move2" | "singleMove";

// Ajuste de espaçamento da descrição de uma box, feito no modo editor: valores somados ao estilo padrão (0 = padrão)
type DescriptionSpacing = { lineHeight: number; letterSpacing: number };

// Quanto cada toque nas setas do modo editor muda (em px da carta 744x1045)
const LINE_HEIGHT_STEP = 1;
const LETTER_SPACING_STEP = 0.25;

// Altura natural da linha na fonte GillSans, proporcional ao tamanho: (ascender + descender) / unitsPerEm do
// gill_sans.ttf. As descrições não têm lineHeight no estilo, então essa é a base do line height ajustado
const GILL_SANS_LINE_HEIGHT = (1903 + 472) / 2048;

// Tamanho da fonte da descrição do Movimento único (as outras descrições usam o do skillDescriptionText)
const SINGLE_MOVE_DESCRIPTION_FONT_SIZE = 23;

// Mapeamento dos símbolos de raridade (os de tipagem vêm de @/constants/type_icons)
const RARITY_ICONS: Record<string, any> = {
  common: require('../../../assets/images/icons/rarities/common.png'),
  uncommon: require('../../../assets/images/icons/rarities/uncommon.png'),
  rare: require('../../../assets/images/icons/rarities/rare.png'),
  promo: require('../../../assets/images/icons/rarities/promo.png'),
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
  const [isPreEvolutionNameModalVisible, setPreEvolutionNameModalVisible] = useState<boolean>(false);
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
  // Modo editor de descrição de movimento (opção do menu): como o preview, fica fora do histórico de desfazer
  const [editMovesDescription, setEditMovesDescription] = useState<boolean>(false);
  // Box selecionada no modo editor (uma por vez): fica azul em vez de abrir o modal de edição
  const [selectedMoveBox, setSelectedMoveBox] = useState<MoveBox | null>(null);

  // No modo editor, tocar numa box de movimento seleciona ela (ou desmarca, se já estava) em vez de abrir o modal
  const handleMoveBoxPress = (box: MoveBox, openModal: () => void) => {
    if (!editMovesDescription) return openModal();
    setSelectedMoveBox(selectedMoveBox === box ? null : box);
  };
  const isMoveBoxSelected = (box: MoveBox) => editMovesDescription && selectedMoveBox === box;

  // Boxes como no preview (sem borda e fundo, só o valor aparece, e não abrem o modal): no preview, todas;
  // no modo editor de descrição, todas menos as de Habilidade e de nome/descrição dos movimentos
  const hideBoxes = isPreviewMode || editMovesDescription;

  const cardRef = useRef<React.ComponentRef<typeof View>>(null);

  const [history, setHistory] = useState<CardState[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const currentState = history[historyIndex];

  const checkTemplates = (array: string[], condition: string) => {
    return array.includes(condition);
  }

  const buttonCheckTemplate = () => checkTemplates(BUTTON_CUSTOM_TEMPLATES, currentTemplate)
  const textCheckTemplate = () => checkTemplates(TEXT_CUSTOM_TEMPLATES, currentTemplate)

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
    currentTemplate, currentStage, pokemonImage, collectionSymbol, preEvolutionImage, preEvolutionName, hp, name, description, curiosity,
    illustration, pokemonNumber, rarity, extraInfo, weakness, secondWeakness,
    weaknessValue, level, resistance, secondResistance, resistanceValue, retreat, movesCount,
    weaknessesCount, resistancesCount, hasPassiveSkill, passiveSkill, firstSkill, firstSkillDamage,
    firstSkillEnergy, secondSkill, secondSkillDamage, secondSkillEnergy, descriptionSpacing
  } = currentState;

  const templateSource = CARD_TEMPLATES[currentStage][currentTemplate];
  const templateWidth = Image.resolveAssetSource(templateSource)?.width ?? 0;
  const isStageCard = currentStage !== "basic";

  // Nas cartas de estágio a estrela invade a janela da foto: a foto e a box são desenhadas em SVG
  // seguindo o contorno do layout do template (identificado pela largura da imagem)
  const stageImageOutline: OutlinePoint[] | undefined = isStageCard
    ? STAGE_IMAGE_OUTLINES[templateWidth]
    : undefined;

  // ========= Modo editor de descrição: espaçamento da descrição de cada box =========
  const spacingOf = (box: MoveBox): DescriptionSpacing =>
    descriptionSpacing[box] ?? { lineHeight: 0, letterSpacing: 0 };
  const isSpacingAdjusted = (box: MoveBox) =>
    spacingOf(box).lineHeight !== 0 || spacingOf(box).letterSpacing !== 0;
  const baseLineHeight = (box: MoveBox) =>
    Math.round(
      (box === "singleMove" ? SINGLE_MOVE_DESCRIPTION_FONT_SIZE : styles.skillDescriptionText.fontSize) *
        GILL_SANS_LINE_HEIGHT
    );

  // Estilo extra da descrição: só existe se o usuário ajustou o espaçamento dela; sem ajuste fica o estilo padrão
  const descriptionSpacingStyle = (box: MoveBox, hasDescription: boolean) => {
    if (!hasDescription || !isSpacingAdjusted(box)) return null;
    const { lineHeight, letterSpacing } = spacingOf(box);
    return {
      ...(lineHeight !== 0 ? { lineHeight: baseLineHeight(box) + lineHeight } : {}),
      ...(letterSpacing !== 0 ? { letterSpacing } : {}),
      // Com o line height menor, as letras passam da caixa do Text, e o overflow padrão as cortaria (ver nameText)
      overflow: "visible" as const,
    };
  };
  // Na Habilidade e nos Movimentos 1 e 2 o nome fica dentro do parágrafo da descrição: sem isso herdaria o letter spacing
  const keepNameSpacing = (box: MoveBox) => isSpacingAdjusted(box) && { letterSpacing: 0 };

  // Setas do modo editor: somam um passo ao espaçamento da descrição da box selecionada
  const adjustDescriptionSpacing = (change: Partial<DescriptionSpacing>) => {
    if (!selectedMoveBox) return;
    const current = spacingOf(selectedMoveBox);
    const lineHeight = current.lineHeight + (change.lineHeight ?? 0);
    if (baseLineHeight(selectedMoveBox) + lineHeight < 1) return; // o line height precisa continuar positivo
    updateCard({
      descriptionSpacing: {
        ...descriptionSpacing,
        [selectedMoveBox]: { lineHeight, letterSpacing: current.letterSpacing + (change.letterSpacing ?? 0) },
      },
    });
  };

  // Girar: volta a descrição da box selecionada para o estilo padrão
  const resetDescriptionSpacing = () => {
    if (!selectedMoveBox) return;
    const { [selectedMoveBox]: _reset, ...otherBoxes } = descriptionSpacing;
    updateCard({ descriptionSpacing: otherBoxes });
  };
  const canResetSpacing = selectedMoveBox !== null && isSpacingAdjusted(selectedMoveBox);
  // Sem box selecionada as setas ficam apagadas, como o Girar
  const canAdjustSpacing = selectedMoveBox !== null;

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

  // Abre a galeria do usuário pra selecionar uma imagem e entrega a uri escolhida pro onPick
  const pickImage = async (onPick: (uri: string) => void) => {
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
      onPick(result.assets[0].uri);
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
            <Image source={templateSource} style={styles.cardImage} />

            {/* ========= BEGIN:: Pré-evolução (só cartas de estágio) ========= */}
            {isStageCard && (
              <TouchableOpacity
                style={[
                  styles.preEvolutionButton,
                  buttonCheckTemplate() && styles.preEvolutionButtonCustom,
                  hideBoxes && styles.previewMode,
                  // Sem a borda (transparente) na prévia, a foto ocupa a box inteira e cobre o prateado da estrela
                  hideBoxes && { borderWidth: 0 },
                ]}
                onPress={() => pickImage((uri) => updateCard({ preEvolutionImage: uri }))}
                disabled={hideBoxes}
              >
                {preEvolutionImage ?
                  <Image
                    source={{ uri: preEvolutionImage }}
                    style={styles.preEvolutionImage}
                  />
                : null}
              </TouchableOpacity>
            )}
            {/* ========= END:: Pré-evolução ========= */}

            {/* ========= BEGIN:: Evolui de (só cartas de estágio) ========= */}
            {isStageCard && (
              <TouchableOpacity
                style={[
                  styles.preEvolutionNameButton,
                  buttonCheckTemplate() && styles.preEvolutionNameButtonCustom,
                  hideBoxes && styles.previewMode,
                ]}
                onPress={() => setPreEvolutionNameModalVisible(true)}
                disabled={hideBoxes}
              >
                {preEvolutionName ? (
                  <ResponsiveText
                    style={[
                      styles.preEvolutionNameText,
                      textCheckTemplate() && { color: "#fff" },
                    ]}
                  >
                    Evolui de {preEvolutionName}
                  </ResponsiveText>
                ) : null}
              </TouchableOpacity>
            )}
            {/* ========= END:: Evolui de ========= */}

            {/* ========= BEGIN:: Nome ========= */}
            <TouchableOpacity
              style={[
                styles.nameButton,
                isStageCard && { left: 180, width: 210 },
                buttonCheckTemplate() && styles.nameButtonCustom,
                buttonCheckTemplate() && isStageCard && {
                  top: 67,
                  left: 170,
                  width: 230,
                  height: 51
                },
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => setNameModalVisible(true)}
              disabled={hideBoxes}
            >
              {name ?
                <ResponsiveText
                  style={[
                    styles.nameText,
                    buttonCheckTemplate() && styles.nameTextCustom,
                    buttonCheckTemplate() && isStageCard && { fontSize: 45 },
                    textCheckTemplate() && { color: "#fff" },
                  ]}
                >
                  {name}
                </ResponsiveText>
              : null }
            </TouchableOpacity>
            {/* ========= END:: Nome ========= */}

            {/* ========= BEGIN:: Level ========= */}
            <TouchableOpacity
              style={[
                styles.levelButton,
                buttonCheckTemplate() && styles.levelButtonCustom,
                hideBoxes && styles.previewMode,
                {
                  right: buttonCheckTemplate()
                    ? (hp.length > 2 ? 265 : 240)
                    : (hp.length > 2 ? 285 : 260)
                },
              ]}
              onPress={() => setLevelModalVisible(true)}
              disabled={hideBoxes}
            >
              {level ?
                <ResponsiveText style={[styles.levelText, textCheckTemplate() && { color: "#fff" }]}>
                  Nv.{level}
                </ResponsiveText>
              : null}
            </TouchableOpacity>
            {/* ========= END:: Level ========= */}

            {/* ========= BEGIN:: HP ========= */}
            <TouchableOpacity
              style={[
                styles.hpButton,
                isStageCard && { top: 73 },
                buttonCheckTemplate() && styles.hpButtonCustom,
                hideBoxes && styles.previewMode,
                { width: hp.length > 2 ? 150 : 125 },
              ]}
              onPress={() => setHpModalVisible(true)}
              disabled={hideBoxes}
            >
              {hp ?
                <ResponsiveText style={[styles.hpText, textCheckTemplate() && { color: "#fff" }]}>
                  {hp} HP
                </ResponsiveText>
              : null}
            </TouchableOpacity>
            {/* ========= END:: HP ========= */}

            {/* ========= BEGIN:: Tipo ========= */}
            <TouchableOpacity
              style={[
                styles.typeButton,
                buttonCheckTemplate() && styles.typeButtonCustom,
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => setTypeModalVisible(true)}
              disabled={hideBoxes}
            />
            {/* ========= END:: Tipo ========= */}

            {/* ========= BEGIN:: Imagem ========= */}
            {/* Cartas de estágio: foto recortada e box desenhada no contorno da estrela (o toque fica na box abaixo) */}
            {/* A key recria o SVG quando o layout do template muda: o react-native-svg mantém o recorte
                (ClipPath) e o desenho em cache no nativo e não os atualiza só com a troca das props */}
            {stageImageOutline && (
              <Svg
                key={`stageImage-${templateWidth}`}
                style={StyleSheet.absoluteFill}
                viewBox={`0 0 ${CARD_REAL_WIDTH} ${CARD_REAL_HEIGHT}`}
                pointerEvents="none"
              >
                <Defs>
                  <ClipPath id={`stageImageClip-${templateWidth}`}>
                    <Path d={outlineToPath(stageImageOutline)} />
                  </ClipPath>
                </Defs>
                {!hideBoxes && (
                  <Path d={outlineToPath(stageImageOutline)} fill="rgba(255, 255, 255, 0.2)" />
                )}
                {pokemonImage && (
                  <SvgImage
                    href={{ uri: pokemonImage }}
                    {...outlineBox(stageImageOutline)}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#stageImageClip-${templateWidth})`}
                  />
                )}
                {!hideBoxes && (
                  <Path
                    d={outlineToPath(stageImageOutline)}
                    fill="none"
                    stroke={buttonCheckTemplate() ? "black" : "white"}
                    strokeWidth={3}
                    strokeLinejoin="round"
                  />
                )}
              </Svg>
            )}
            <TouchableOpacity
              style={[
                styles.imageButton,
                buttonCheckTemplate() && styles.imageButtonCustom,
                stageImageOutline && styles.imageButtonStage,
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => pickImage((uri) => updateCard({ pokemonImage: uri }))}
              disabled={hideBoxes}
            >
              {pokemonImage
                ? !stageImageOutline && <Image source={{ uri: pokemonImage }} style={styles.pokemonImage} />
                : !hideBoxes && (
                  <ResponsiveText style={[styles.imageButtonText, buttonCheckTemplate() && styles.imageButtonTextCustom]}>
                    Clique aqui para{"\n"}adicionar uma imagem
                  </ResponsiveText>
                )
              }
            </TouchableOpacity>
            {/* ========= END:: Imagem ========= */}

            {/* ========= BEGIN:: Descrição ========= */}
            <TouchableOpacity
              style={[
                styles.descriptionButton,
                buttonCheckTemplate() && styles.descriptionButtonCustom,
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => setDescriptionModalVisible(true)}
              disabled={hideBoxes}
            >
              {description ?
                <ResponsiveText style={[styles.descriptionText, textCheckTemplate() && { color: "#fff" }]}>
                  {description}
                </ResponsiveText>
              : null}
            </TouchableOpacity>
            {/* ========= END:: Descrição ========= */}

            {/* ========= BEGIN:: Símbolo da Coleção ========= */}
            <TouchableOpacity
              style={[
                styles.collectionSymbolButton,
                buttonCheckTemplate() && styles.collectionSymbolButtonCustom,
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => pickImage((uri) => updateCard({ collectionSymbol: uri }))}
              disabled={hideBoxes}
            >
              {collectionSymbol ?
                <Image
                  source={{ uri: collectionSymbol }}
                  style={styles.collectionSymbolImage}
                />
              : null}
            </TouchableOpacity>
            {/* ========= END:: Símbolo da Coleção ========= */}

            {/* ========= BEGIN:: Habilidade ========= */}
            {hasPassiveSkill && (
              <TouchableOpacity
                style={[
                  styles.passiveSkillButton,
                  buttonCheckTemplate() && styles.passiveSkillButtonCustom,
                  isPreviewMode && styles.previewMode,
                  isMoveBoxSelected("passive") && styles.selectedBox,
                ]}
                accessibilityLabel="Habilidade"
                onPress={() => handleMoveBoxPress("passive", () => setPassiveSkillModalVisible(true))}
                disabled={isPreviewMode}
              >
                {passiveSkill ? (
                  <ResponsiveText
                    style={[
                      styles.skillDescriptionText,
                      { width: '100%' },
                      textCheckTemplate() && { color: "#fff" },
                      descriptionSpacingStyle("passive", !!passiveSkill.description?.trim()),
                    ]}
                  >
                    <ResponsiveText style={[styles.skillNameText, { color: passiveSkill.color || '#CC0000', fontSize: 25 }, keepNameSpacing("passive")]}>
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
                    hideBoxes && styles.previewMode,
                  ]}
                  accessibilityLabel="Custo do Movimento 1"
                  onPress={() => setFirstSkillEnergyModalVisible(true)}
                  disabled={hideBoxes}
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
                    isPreviewMode && styles.previewMode,
                    isMoveBoxSelected("move1") && styles.selectedBox,
                  ]}
                  accessibilityLabel="Movimento 1"
                  onPress={() => handleMoveBoxPress("move1", () => setFirstSkillModalVisible(true))}
                  disabled={isPreviewMode}
                >
                  {firstSkill ? (
                    <ResponsiveText
                      style={[
                        styles.skillDescriptionText,
                        !firstSkill.description?.trim() && { textAlign: "center", width: "100%" },
                        textCheckTemplate() && { color: "#fff" },
                        descriptionSpacingStyle("move1", !!firstSkill.description?.trim()),
                      ]}
                    >
                      <ResponsiveText style={[styles.skillNameText, textCheckTemplate() && { color: "#fff" }, keepNameSpacing("move1")]}>{firstSkill.name}</ResponsiveText>
                      {firstSkill.description ? ` ${firstSkill.description}` : ""}
                    </ResponsiveText>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Nome e descrição ========= */}

                {/* ========= BEGIN:: Qtd. de Dano ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillDamageButton,
                    hideBoxes && styles.previewMode,
                  ]}
                  accessibilityLabel="Dano do Movimento 1"
                  onPress={() => setFirstSkillDamageModalVisible(true)}
                  disabled={hideBoxes}
                >
                  {firstSkillDamage ?
                    <ResponsiveText
                      style={[
                        styles.skillDamageText,
                        firstSkillDamage.includes('+') && { fontSize: 30 },
                        textCheckTemplate() && { color: "#fff" },
                      ]}
                    >
                      {firstSkillDamage}
                    </ResponsiveText>
                  : null}
                </TouchableOpacity>
                {/* ========= END:: Qtd. de Dano ========= */}
              </>
            )}
            {/* ========= END:: Movimento 1 ========= */}

            {/* ========= BEGIN:: Separador ========= */}
            {(movesCount === 2 || (movesCount === 1 && hasPassiveSkill)) && (
              <View
                style={[
                  styles.movesSeparatorLine,
                  buttonCheckTemplate() && movesCount === 1 && hasPassiveSkill && styles.movesSeparatorLineCustom,
                  currentTemplate === "dark" &&{ backgroundColor: 'white' }
                ]}
              />
            )}
            {/* ========= END:: Separador ========= */}

            {/* ========= BEGIN:: Movimento 2 ========= */}
            {(movesCount === 2 || (movesCount === 1 && hasPassiveSkill)) && (
              <>
                {/* ========= BEGIN:: Custo ========= */}
                <TouchableOpacity
                  style={[
                    styles.secondSkillEnergyButton,
                    buttonCheckTemplate() && movesCount === 1 && hasPassiveSkill && styles.secondSkillEnergyButtonCustom,
                    hideBoxes && styles.previewMode,
                  ]}
                  accessibilityLabel="Custo do Movimento 2"
                  onPress={() => setSecondSkillEnergyModalVisible(true)}
                  disabled={hideBoxes}
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
                    buttonCheckTemplate() && movesCount === 1 && hasPassiveSkill && styles.secondSkillButtonCustom,
                    isPreviewMode && styles.previewMode,
                    isMoveBoxSelected("move2") && styles.selectedBox,
                  ]}
                  accessibilityLabel="Movimento 2"
                  onPress={() => handleMoveBoxPress("move2", () => setSecondSkillModalVisible(true))}
                  disabled={isPreviewMode}
                >
                  {secondSkill ? (
                    <ResponsiveText
                      style={[
                        styles.skillDescriptionText,
                        !secondSkill.description?.trim() && { textAlign: "center", width: "100%" },
                        textCheckTemplate() && { color: "#fff" },
                        descriptionSpacingStyle("move2", !!secondSkill.description?.trim()),
                      ]}
                    >
                      <ResponsiveText style={[styles.skillNameText, textCheckTemplate() && { color: "#fff" }, keepNameSpacing("move2")]}>{secondSkill.name}</ResponsiveText>
                      {secondSkill.description ? ` ${secondSkill.description}` : ""}
                    </ResponsiveText>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Nome e descrição ========= */}

                {/* ========= BEGIN:: Qtd. de Dano ========= */}
                <TouchableOpacity
                  style={[
                    styles.secondSkillDamageButton,
                    buttonCheckTemplate() && movesCount === 1 && hasPassiveSkill && styles.secondSkillDamageButtonCustom,
                    hideBoxes && styles.previewMode,
                  ]}
                  accessibilityLabel="Dano do Movimento 2"
                  onPress={() => setSecondSkillDamageModalVisible(true)}
                  disabled={hideBoxes}
                >
                  {secondSkillDamage ?
                    <ResponsiveText
                      style={[
                        styles.skillDamageText,
                        secondSkillDamage.includes('+') && { fontSize: 30 },
                        textCheckTemplate() && { color: "#fff" }
                      ]}
                    >
                      {secondSkillDamage}
                    </ResponsiveText>
                  : null}
                </TouchableOpacity>
                {/* ========= END:: Qtd. de Dano ========= */}
              </>
            )}
            {/* ========= END:: Movimento 2 ========= */}

            {/* ========= BEGIN:: Movimento único ========= */}
            {movesCount === 1 && !hasPassiveSkill && (
              <>
                {/* ========= BEGIN:: Custo ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillEnergyButton,
                    hideBoxes && styles.previewMode,
                    { top: 650, height: 100 },
                  ]}
                  accessibilityLabel="Custo do Movimento único"
                  onPress={() => setFirstSkillEnergyModalVisible(true)}
                  disabled={hideBoxes}
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
                    styles.singleSkillButton,
                    isPreviewMode && styles.previewMode,
                    isMoveBoxSelected("singleMove") && styles.selectedBox,
                  ]}
                  accessibilityLabel="Movimento único"
                  onPress={() => handleMoveBoxPress("singleMove", () => setFirstSkillModalVisible(true))}
                  disabled={isPreviewMode}
                >
                  {firstSkill ? (
                    <>
                      <ResponsiveText
                        style={[
                          styles.skillNameText,
                          { fontSize: 35 },
                          !firstSkill.description?.trim() && { textAlign: 'center', width: '100%' },
                          textCheckTemplate() && { color: "#fff" }
                        ]}
                      >
                        {firstSkill.name}
                      </ResponsiveText>

                      {firstSkill.description ? (
                        <ResponsiveText
                          style={[
                            styles.skillDescriptionText,
                            { fontSize: SINGLE_MOVE_DESCRIPTION_FONT_SIZE, textAlign: 'left', marginTop: 5 },
                            textCheckTemplate() && { color: "#fff" },
                            descriptionSpacingStyle("singleMove", !!firstSkill.description.trim()),
                          ]}
                        >
                          {firstSkill.description}
                        </ResponsiveText>
                      ) : null}
                    </>
                  ) : null}
                </TouchableOpacity>
                {/* ========= END:: Nome e descrição ========= */}

                {/* ========= BEGIN:: Qtd. de Dano ========= */}
                <TouchableOpacity
                  style={[
                    styles.firstSkillDamageButton,
                    hideBoxes && styles.previewMode,
                    { top: 650, height: 100 }, // Valores provisórios centralizados
                  ]}
                  accessibilityLabel="Dano do Movimento único"
                  onPress={() => setFirstSkillDamageModalVisible(true)}
                  disabled={hideBoxes}
                >
                  {firstSkillDamage ?
                    <ResponsiveText
                      style={[
                        styles.skillDamageText,
                        firstSkillDamage.includes('+') && { fontSize: 30 },
                        textCheckTemplate() && { color: "#fff" },
                      ]}
                    >
                      {firstSkillDamage}
                    </ResponsiveText>
                  : null}
                </TouchableOpacity>
                {/* ========= END:: Qtd. de Dano ========= */}
              </>
            )}
            {/* ========= END:: Movimento único ========= */}

            {/* ========= BEGIN:: Fraquezas ========= */}
            {/* ========= BEGIN:: Fraqueza 1 ========= */}
            <TouchableOpacity
              style={[
                styles.weaknessButton,
                weaknessesCount === 2 && { left: 89 },
                buttonCheckTemplate() && styles.weaknessButtonCustom,
                buttonCheckTemplate() && weaknessesCount === 2 && { left: 79 },
                hideBoxes && styles.previewMode,
                !buttonCheckTemplate() && hideBoxes && {
                  left: weaknessesCount === 2 ? 90 : 110
                },
              ]}
              onPress={() => setWeaknessModalVisible(true)}
              disabled={hideBoxes}
            >
              {weakness ? (
                <Image
                  source={TYPE_ICONS[weakness]}
                  style={[styles.icons, buttonCheckTemplate() && styles.iconsCustom]}
                />
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Fraqueza 1 ========= */}

            {/* ========= BEGIN:: Fraqueza 2 ========= */}
            {weaknessesCount === 2 && (
              <TouchableOpacity
                style={[
                  styles.secondWeaknessButton,
                  buttonCheckTemplate() && styles.secondWeaknessButtonCustom,
                  hideBoxes && styles.previewMode,
                  !buttonCheckTemplate() && hideBoxes && {
                    left: 135,
                  },
                ]}
                onPress={() => setSecondWeaknessModalVisible(true)}
                disabled={hideBoxes}
              >
                {secondWeakness ? (
                  <Image
                    source={TYPE_ICONS[secondWeakness]}
                    style={[styles.icons, buttonCheckTemplate() && styles.iconsCustom]}
                  />
                ) : null}
              </TouchableOpacity>
            )}
            {/* ========= END:: Fraqueza 2 ========= */}

            {/* ========= BEGIN:: Valor das fraquezas ========= */}
            <TouchableOpacity
              style={[
                styles.weaknessValueButton,
                weaknessesCount === 2 && { left: 184 },
                buttonCheckTemplate() && styles.weaknessValueButtonCustom,
                buttonCheckTemplate() && weaknessesCount === 2 && { left: 167 },
                hideBoxes && styles.previewMode,
                !buttonCheckTemplate() &&  hideBoxes && { left: weaknessesCount === 2 ? 180 : 155 },
              ]}
              onPress={() => setWeaknessValueModalVisible(true)}
              disabled={hideBoxes}
            >
              {weaknessValue ?
                <ResponsiveText
                  style={[
                    styles.valuesText,
                    buttonCheckTemplate() && styles.valuesTextCustom,
                    textCheckTemplate() && { color: "#fff" }
                  ]}
                >
                  {weaknessValue}
                </ResponsiveText>
              : null}
            </TouchableOpacity>
            {/* ========= END:: Valor das fraquezas ========= */}
            {/* ========= END:: Fraquezas ========= */}

            {/* ========= BEGIN:: Resistências ========= */}
            {/* ========= BEGIN:: Resistência 1 ========= */}
            <TouchableOpacity
              style={[
                styles.resistanceButton,
                resistancesCount === 2 && { left: 316 },
                buttonCheckTemplate() && styles.resistanceButtonCustom,
                buttonCheckTemplate() && resistancesCount === 2 && { left: 319 },
                hideBoxes && styles.previewMode,
                hideBoxes && {
                  left: resistancesCount === 2 ? 318 : 338
                },
              ]}
              onPress={() => setResistanceModalVisible(true)}
              disabled={hideBoxes}
            >
              {resistance ? (
                <Image
                  source={TYPE_ICONS[resistance]}
                  style={[styles.icons, buttonCheckTemplate() && styles.iconsCustom]}
                />
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Resistência 1 ========= */}

            {/* ========= BEGIN:: Resistência 2 ========= */}
            {resistancesCount === 2 && (
              <TouchableOpacity
                style={[
                  styles.secondResistanceButton,
                  buttonCheckTemplate() && styles.secondResistanceButtonCustom,
                  hideBoxes && styles.previewMode,
                  hideBoxes && {
                    left: 363
                  },
                ]}
                onPress={() => setSecondResistanceModalVisible(true)}
                disabled={hideBoxes}
              >
                {secondResistance ? (
                  <Image
                    source={TYPE_ICONS[secondResistance]}
                    style={[styles.icons, buttonCheckTemplate() && styles.iconsCustom]}
                  />
                ) : null}
              </TouchableOpacity>
            )}
            {/* ========= END:: Resistência 2 ========= */}

            {/* ========= BEGIN:: Valor das resistências ========= */}
            <TouchableOpacity
              style={[
                styles.resistanceValueButton,
                resistancesCount === 2 && { left: 412 },
                buttonCheckTemplate() && styles.resistanceValueButtonCustom,
                buttonCheckTemplate() && resistancesCount === 2 && { left: 407 },
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => setResistanceValueModalVisible(true)}
              disabled={hideBoxes}
            >
              {resistanceValue ?
                <ResponsiveText
                  style={[
                    styles.valuesText,
                    buttonCheckTemplate() && styles.valuesTextCustom,
                    textCheckTemplate() && { color: "#fff" }
                  ]}
                >
                  {resistanceValue}
                </ResponsiveText>
              : null}
            </TouchableOpacity>
            {/* ========= END:: Valor das resistências ========= */}
            {/* ========= END:: Resistências ========= */}

            {/* ========= BEGIN:: Custo de retirada ========= */}
            <TouchableOpacity
              style={[
                styles.retreatButton,
                buttonCheckTemplate() && styles.retreatButtonCustom,
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => setRetreatModalVisible(true)}
              disabled={hideBoxes}
            >
              {retreat ? (
                <View style={{ flexDirection: 'row', gap: 2 }}>
                  {Array.from({ length: retreat.count }).map((_, i) => (
                    <Image
                      key={i}
                      source={TYPE_ICONS[retreat.symbol]}
                      style={[
                        styles.icons,
                        buttonCheckTemplate() && styles.iconsCustom,
                      ]}
                    />
                  ))}
                </View>
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Custo de retirada ========= */}

            {/* ========= BEGIN:: Curiosidade ========= */}
            <TouchableOpacity
              style={[
                styles.curiosityButton,
                buttonCheckTemplate() && styles.curiosityButtonCustom,
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => setCuriosityModalVisible(true)}
              disabled={hideBoxes}
            >
              {curiosity ?
                <ResponsiveText style={[ styles.curiosityText, textCheckTemplate() && { color: "#fff" }]}>
                  {curiosity}
                </ResponsiveText>
              : null}
            </TouchableOpacity>
            {/* ========= END:: Curiosidade ========= */}

            {/* ========= BEGIN:: Illustrador ========= */}
            <TouchableOpacity
              style={[
                styles.illustrationButton,
                buttonCheckTemplate() && styles.illustrationButtonCustom,
                hideBoxes && styles.previewMode,
                !buttonCheckTemplate() && hideBoxes && { left: 45 },
              ]}
              onPress={() => setIllustrationModalVisible(true)}
              disabled={hideBoxes}
            >
              {illustration ? (
                <ResponsiveText style={[styles.illustrationText, textCheckTemplate() && { color: "#fff" }]}>
                  Illus. {illustration}
                </ResponsiveText>
              ) : null}
            </TouchableOpacity>
            {/* ========= END:: Illustrador ========= */}

            {/* ========= BEGIN:: Licença ========= */}
            <TouchableOpacity
              style={[
                styles.extraInfoButton,
                buttonCheckTemplate() && styles.extraInfoButtonCustom,
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => setExtraInfoModalVisible(true)}
              disabled={hideBoxes}
            >
              {extraInfo ?
                <ResponsiveText style={[styles.extraInfoText, textCheckTemplate() && { color: "#fff" }]}>
                  {extraInfo}
                </ResponsiveText>
              : null}
            </TouchableOpacity>
            {/* ========= END:: Licença ========= */}

            {/* ========= BEGIN:: Número da coleção ========= */}
            <TouchableOpacity
              style={[
                styles.pokemonNumberButton,
                buttonCheckTemplate() && styles.pokemonNumberButtonCustom,
                hideBoxes && styles.previewMode,
              ]}
              onPress={() => setPokemonNumberModalVisible(true)}
              disabled={hideBoxes}
            >
              {pokemonNumber ?
                <ResponsiveText style={[styles.pokemonNumberText, textCheckTemplate() && { color: "#fff" }]}>
                  {pokemonNumber}
                </ResponsiveText>
              : null}
            </TouchableOpacity>
            {/* ========= END:: Número da coleção ========= */}

            {/* ========= BEGIN:: Raridade ========= */}
            <TouchableOpacity
                style={[
                  styles.rarityButton,
                  buttonCheckTemplate() && styles.rarityButtonCustom,
                  hideBoxes && styles.previewMode,
                ]}
                onPress={() => setRarityModalVisible(true)}
                disabled={hideBoxes}
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
          stage={currentStage}
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

        {/* Modal de Pré-Evolução */}
        <PreEvolutionNameModal
          visible={isPreEvolutionNameModalVisible}
          onClose={() => setPreEvolutionNameModalVisible(false)}
          onSave={(valor) => {
            updateCard({ preEvolutionName: valor });
            setPreEvolutionNameModalVisible(false);
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
          currentTemplate={currentTemplate}
          stage={currentStage}
          onSelectStage={(stage) => updateCard({ currentStage: stage })}
          movesCount={movesCount}
          onSelectMovesCount={(count) => {
            setSelectedMoveBox(null); // a box selecionada no modo editor pode deixar de existir
            if (count === 2) {
              updateCard({ movesCount: count, hasPassiveSkill: false });
            } else {
              updateCard({ movesCount: count });
            }
          }}
          hasPassiveSkill={hasPassiveSkill}
          onSelectPassiveSkill={(hasPassive) => {
            setSelectedMoveBox(null); // a box selecionada no modo editor pode deixar de existir
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
          editMovesDescription={editMovesDescription}
          onSelectEditMovesDescription={(edit) => {
            setEditMovesDescription(edit);
            setSelectedMoveBox(null); // ligar ou desligar o modo sempre começa sem box selecionada
          }}
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
          {editMovesDescription ? (
            <>
              {/* Modo editor de descrição de movimento (opção "Editar desc. de Mov." do menu): os ícones ajustam
                  o espaçamento da descrição da box selecionada; o menu continua para o usuário desligar o modo */}
              {/* Girar: volta a descrição da box selecionada para o padrão (só com algum ajuste feito) */}
              <TouchableOpacity
                accessibilityLabel="Restaurar espaçamento da descrição"
                onPress={resetDescriptionSpacing}
                disabled={!canResetSpacing}
                style={{ opacity: canResetSpacing ? 1 : 0.3 }}
              >
                <Image
                  source={require("../../../assets/images/icons/rotate-ccw.png")}
                  style={[styles.footerIcon]}
                />
              </TouchableOpacity>

              {/* Cima: diminui o line height */}
              <TouchableOpacity
                accessibilityLabel="Diminuir altura da linha"
                onPress={() => adjustDescriptionSpacing({ lineHeight: -LINE_HEIGHT_STEP })}
                disabled={!canAdjustSpacing}
                style={{ opacity: canAdjustSpacing ? 1 : 0.3 }}
              >
                <Image
                  source={require("../../../assets/images/icons/arrow-up.png")}
                  style={[styles.footerIcon]}
                />
              </TouchableOpacity>

              {/* Baixo: aumenta o line height */}
              <TouchableOpacity
                accessibilityLabel="Aumentar altura da linha"
                onPress={() => adjustDescriptionSpacing({ lineHeight: LINE_HEIGHT_STEP })}
                disabled={!canAdjustSpacing}
                style={{ opacity: canAdjustSpacing ? 1 : 0.3 }}
              >
                <Image
                  source={require("../../../assets/images/icons/arrow-down.png")}
                  style={[styles.footerIcon]}
                />
              </TouchableOpacity>

              {/* Esquerda: diminui o letter spacing */}
              <TouchableOpacity
                accessibilityLabel="Diminuir espaço entre letras"
                onPress={() => adjustDescriptionSpacing({ letterSpacing: -LETTER_SPACING_STEP })}
                disabled={!canAdjustSpacing}
                style={{ opacity: canAdjustSpacing ? 1 : 0.3 }}
              >
                <Image
                  source={require("../../../assets/images/icons/arrow-left.png")}
                  style={[styles.footerIcon]}
                />
              </TouchableOpacity>

              {/* Direita: aumenta o letter spacing */}
              <TouchableOpacity
                accessibilityLabel="Aumentar espaço entre letras"
                onPress={() => adjustDescriptionSpacing({ letterSpacing: LETTER_SPACING_STEP })}
                disabled={!canAdjustSpacing}
                style={{ opacity: canAdjustSpacing ? 1 : 0.3 }}
              >
                <Image
                  source={require("../../../assets/images/icons/arrow-right.png")}
                  style={[styles.footerIcon]}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Undo */}
              <TouchableOpacity
                accessibilityLabel="Desfazer"
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
                accessibilityLabel="Salvar"
                onPress={handleSaveCard}
                style={{ opacity: 1 }}
              >
                <Image
                  source={require("../../../assets/images/icons/save.png")}
                  style={styles.footerIcon}
                />
              </TouchableOpacity>

              {/* Preview */}
              <TouchableOpacity accessibilityLabel="Pré-visualizar" onPress={() => setIsPreviewMode(!isPreviewMode)}>
                <Image
                  source={require("../../../assets/images/icons/eye.png")}
                  style={styles.footerIcon}
                />
              </TouchableOpacity>

              {/* Redo */}
              <TouchableOpacity
                accessibilityLabel="Refazer"
                onPress={redo}
                disabled={isPreviewMode || !canRedo}
                style={{ opacity: isPreviewMode || !canRedo ? 0.3 : 1 }}
              >
                <Image
                  source={require("../../../assets/images/icons/arrow_right.png")}
                  style={styles.footerIcon}
                />
              </TouchableOpacity>
            </>
          )}

          {/* Menu */}
          <TouchableOpacity
            accessibilityLabel="Menu"
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
  // Box selecionada no modo editor de descrição de movimento: troca o branco da box por azul
  selectedBox: {
    borderColor: "#3B82F6",
    backgroundColor: "rgba(59, 130, 246, 0.2)",
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
  movesSeparatorLineCustom: {
    top: 730,
  },
  // ========= BEGIN:: Pré-evolução =========
  preEvolutionButton: {
    position: "absolute",
    top: 89,
    left: 64,
    width: 93,
    height: 79,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  preEvolutionButtonCustom: {
    top: 81,
    left: 59,
    width: 89,
    height: 80,
  },
  preEvolutionImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  // ========= END:: Pré-evolução =========

  // ========= BEGIN:: Evolui de =========
  preEvolutionNameButton: {
    position: "absolute",
    top: 45,
    left: 160,
    width: 205,
    height: 25,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },
  preEvolutionNameButtonCustom: {
    height: 23,
    top: 42,
    left: 150,
  },
  preEvolutionNameText: {
    fontFamily: "GillSans-Bold-Italic",
    fontSize: 17,
    color: "#000",
    includeFontPadding: false,
    // Mesmo caso do nameText: o overflow: "hidden" padrão do Text cortava as pernas do g, j, p e q
    overflow: "visible",
  },
  // ========= END:: Evolui de =========

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
    fontSize: 51,
    color: "#000",
    includeFontPadding: false,
    lineHeight: 47,
    // O lineHeight é menor que a altura natural da fonte, então as pernas do g, j, p e q passam da
    // caixa do Text. O RN põe overflow: "hidden" em todo Text por padrão, e era isso que as cortava.
    overflow: "visible",
  },
  nameTextCustom: {
    fontSize: 46,
    lineHeight: 38,
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
    top: 69,
    right: 130,
    width: 150,
    height: 50,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "flex-start",
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
  // A caixa é 3px maior de cada lado que a janela do template (85→659 x 132→530):
  // assim a imagem, que fica por dentro da borda de 3px, cobre a janela branca inteira
  imageButtonCustom: {
    top: 128,
    left: 82,
    width: 581,
    height: 406,
    borderColor: "black",
  },
  // Nas cartas de estágio a box só recebe o toque: borda, fundo e foto são desenhados pelo SVG
  imageButtonStage: {
    borderColor: "transparent",
    backgroundColor: "transparent",
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

  // ========= BEGIN:: Descrição =========
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
  // ========= END:: Descrição =========

  // ========= BEGIN:: Símbolo da Coleção =========
  collectionSymbolButton: {
    position: "absolute",
    top: 544,
    left: 648,
    width: 45,
    height: 45,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  collectionSymbolImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  collectionSymbolButtonCustom: {
    top: 551,
    left: 656,
  },
  // ========= END:: Símbolo da Coleção =========

  // ========= BEGIN:: Habilidade =========
  passiveSkillButton: {
    position: "absolute",
    top: 590,
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
  passiveSkillButtonCustom: {
    top: 600,
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
    top: 730,
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
  secondSkillEnergyButtonCustom: {
    top: 740,
  },
  secondSkillButton: {
    position: "absolute",
    top: 730,
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
  secondSkillButtonCustom: {
    top: 740,
  },
  secondSkillDamageButton: {
    position: "absolute",
    top: 730,
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
  secondSkillDamageButtonCustom: {
    top: 740,
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
    width: 36,
    height: 36,
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
    width: 36,
    height: 36,
  },
  // ========= END:: Resistências =========

  // ========= BEGIN:: Custo de retirada =========
  retreatButton: {
    position: "absolute",
    top: 862.5,
    right: 58,
    width: 175,
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
    right: 57,
    width: 160,
    height: 39,
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
  icons: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  iconsCustom: {
    width: 36,
    height: 36,
  },
  valuesText: {
    fontFamily: "GillSans",
    fontSize: 23,
    color: "#000",
    textAlign: "center",
  },
  valuesTextCustom: {
    fontSize: 22,
  },
  // ========= END:: Utilitários =========
});



