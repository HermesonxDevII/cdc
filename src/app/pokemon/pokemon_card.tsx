import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import * as ImagePicker from 'expo-image-picker';
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

import { Back } from "@/components/back";
import { TypeModal } from "@/components/modals/type_modal";
import { HpModal } from "@/components/modals/hp_modal";
import { NameModal } from "@/components/modals/name_modal";
import { DescriptionModal } from "@/components/modals/description_modal";
import { CuriosityModal } from "@/components/modals/curiosity_modal";
import { IllustrationModal } from "@/components/modals/illustration_modal";
import { PokemonNumberModal } from "@/components/modals/pokemon_number_modal";
import { ExtraInfoModal } from "@/components/modals/extra_info_modal";
import { WeaknessModal } from "@/components/modals/weakness_modal";
import { ResistanceModal } from "@/components/modals/resistance_modal";
import { RetreatModal } from "@/components/modals/retreat_modal";
import { WeaknessValueModal } from "@/components/modals/weakness_value_modal";
import { ResistanceValueModal } from "@/components/modals/resistance_value_modal";
import { SkillModal } from "@/components/modals/skill_modal";
import { SkillDamageModal } from "@/components/modals/skill_damage_modal";
import { SkillEnergyModal } from "@/components/modals/skill_energy_modal";

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
  const [isTypeModalVisible, setTypeModalVisible] = useState(false);
  const [isHpModalVisible, setHpModalVisible] = useState(false);
  const [isNameModalVisible, setNameModalVisible] = useState(false);
  const [isDescriptionModalVisible, setDescriptionModalVisible] =
    useState(false);
  const [isCuriosityModalVisible, setCuriosityModalVisible] = useState(false);
  const [isIllustrationModalVisible, setIllustrationModalVisible] =
    useState(false);
  const [isPokemonNumberModalVisible, setPokemonNumberModalVisible] =
    useState(false);
  const [isExtraInfoModalVisible, setExtraInfoModalVisible] = useState(false);
  const [isWeaknessModalVisible, setWeaknessModalVisible] = useState(false);
  const [isResistanceModalVisible, setResistanceModalVisible] = useState(false);
  const [isRetreatModalVisible, setRetreatModalVisible] = useState(false);
  const [isWeaknessValueModalVisible, setWeaknessValueModalVisible] = useState(false);
  const [isResistanceValueModalVisible, setResistanceValueModalVisible] = useState(false);
  const [isFirstSkillModalVisible, setFirstSkillModalVisible] = useState(false);
  const [isFirstSkillDamageModalVisible, setFirstSkillDamageModalVisible] = useState(false);
  const [isFirstSkillEnergyModalVisible, setFirstSkillEnergyModalVisible] = useState(false);
  const [isSecondSkillModalVisible, setSecondSkillModalVisible] = useState(false);
  const [isSecondSkillDamageModalVisible, setSecondSkillDamageModalVisible] = useState(false);
  const [isSecondSkillEnergyModalVisible, setSecondSkillEnergyModalVisible] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [currentTemplate, setCurrentTemplate] = useState(TEMPLATES.normal);

  // Imagem do Pokémon
  const [pokemonImage, setPokemonImage] = useState<string | null>(null);
  const [hp, setHp] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [curiosity, setCuriosity] = useState("");
  const [illustration, setIllustration] = useState("");
  const [pokemonNumber, setPokemonNumber] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [weakness, setWeakness] = useState("");
  const [weaknessValue, setWeaknessValue] = useState("");
  const [resistance, setResistance] = useState("");
  const [resistanceValue, setResistanceValue] = useState("");
  const [retreat, setRetreat] = useState<{ symbol: string; count: number } | null>(null);
  const [firstSkill, setFirstSkill] = useState<{ name: string; description: string } | null>(null);
  const [firstSkillDamage, setFirstSkillDamage] = useState("");
  const [firstSkillEnergy, setFirstSkillEnergy] = useState<{ symbol: string; count: number } | null>(null);
  const [secondSkill, setSecondSkill] = useState<{ name: string; description: string } | null>(null);
  const [secondSkillDamage, setSecondSkillDamage] = useState("");
  const [secondSkillEnergy, setSecondSkillEnergy] = useState<{ symbol: string; count: number } | null>(null);

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
      setPokemonImage(result.assets[0].uri);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Back href="/pokemon" />

        {/* Esse é o wrapper que reserva o espaço reduzido na tela para não quebrar o layout */}
        <View style={styles.scaledWrapper}>
          {/* ESSA é a carta real! Ela tem 744x1045. É dela que vamos tirar o print depois! */}
          <View style={styles.realSizeCard}>
            <Image source={currentTemplate} style={styles.cardImage} />

            {/* Botão para trocar o Tipo (Símbolo no canto superior direito) */}
            <TouchableOpacity
              style={[styles.typeButton, isPreviewMode && styles.previewMode]}
              onPress={() => setTypeModalVisible(true)}
              disabled={isPreviewMode}
            />

            {/* Segundo Botão Redondo (Para o HP) */}
            <TouchableOpacity
              style={[styles.hpButton, isPreviewMode && styles.previewMode]}
              onPress={() => setHpModalVisible(true)}
              disabled={isPreviewMode}
            >
              {hp ? <Text style={styles.hpText}>{hp} HP</Text> : null}
            </TouchableOpacity>

            {/* Terceiro Botão Retangular (Para o Nome ou outro campo) */}
            <TouchableOpacity
              style={[styles.nameButton, isPreviewMode && styles.previewMode]}
              onPress={() => setNameModalVisible(true)}
              disabled={isPreviewMode}
            >
              {name ? <Text style={styles.nameText}>{name}</Text> : null}
            </TouchableOpacity>

            {/* Sexto Botão Retangular (Para a Imagem do Pokémon) */}
            <TouchableOpacity
              style={[styles.imageButton, isPreviewMode && styles.previewMode]}
              onPress={pickImage}
              disabled={isPreviewMode}
            >
              {pokemonImage ? (
                <Image source={{ uri: pokemonImage }} style={styles.pokemonImage} />
              ) : (
                !isPreviewMode && (
                  <Text style={styles.imageButtonText}>
                    Clique aqui para{"\n"}adicionar uma imagem
                  </Text>
                )
              )}
            </TouchableOpacity>

            {/* Quarto Botão Retangular (Para algo extra, do lado do nome) */}
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

            {/* Décimo Botão Retangular (Para fraqueza, abaixo da descrição) */}
            <TouchableOpacity
              style={[
                styles.weaknessButton,
                isPreviewMode && styles.previewMode,
                isPreviewMode && {
                  width: 40,
                  height: 40,
                  top: 865, // Posição perfeita que você encontrou para o preview
                  left: 110
                },
              ]}
              onPress={() => setWeaknessModalVisible(true)}
              disabled={isPreviewMode}
            >
              {weakness ? (
                <Image source={TYPE_ICONS[weakness]} style={styles.weaknessIcon} />
              ) : null}
            </TouchableOpacity>

            {/* Botão de Valor da Fraqueza (Ao lado direito da fraqueza) */}
            <TouchableOpacity
              style={[
                styles.weaknessValueButton,
                isPreviewMode && styles.previewMode,
                isPreviewMode && { left: 150 }, // Valor ajustado para o modo preview
              ]}
              onPress={() => setWeaknessValueModalVisible(true)}
              disabled={isPreviewMode}
            >
              {weaknessValue ? (
                <Text style={styles.weaknessValueText}>{weaknessValue}</Text>
              ) : null}
            </TouchableOpacity>

            {/* Décimo Primeiro Botão (Ao lado da fraqueza) */}
            <TouchableOpacity
              style={[
                styles.resistanceButton,
                isPreviewMode && styles.previewMode,
                isPreviewMode && {
                  width: 40,
                  height: 40,
                  top: 865, // Ajuste para o preview
                  left: 340.5 // Ajuste calculado (-2.5px da diferença)
                },
              ]}
              onPress={() => setResistanceModalVisible(true)}
              disabled={isPreviewMode}
            >
              {resistance ? (
                <Image source={TYPE_ICONS[resistance]} style={styles.resistanceIcon} />
              ) : null}
            </TouchableOpacity>

            {/* Botão de Valor da Resistência (Ao lado direito da resistência) */}
            <TouchableOpacity
              style={[
                styles.resistanceValueButton,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setResistanceValueModalVisible(true)}
              disabled={isPreviewMode}
            >
              {resistanceValue ? (
                <Text style={styles.resistanceValueText}>{resistanceValue}</Text>
              ) : null}
            </TouchableOpacity>

            {/* Custo de Energia da Primeira Habilidade (À esquerda da habilidade) */}
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

            {/* Primeira Habilidade (Abaixo da descrição) */}
            <TouchableOpacity
              style={[
                styles.firstSkillButton,
                isPreviewMode && styles.previewMode,
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

            {/* Dano da Primeira Habilidade (Ao lado direito da primeira habilidade) */}
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

            {/* --- SEGUNDA HABILIDADE --- */}
            {/* Custo de Energia da Segunda Habilidade */}
            <TouchableOpacity
              style={[
                styles.secondSkillEnergyButton,
                isPreviewMode && styles.previewMode,
                isPreviewMode && secondSkillEnergy && secondSkillEnergy.count >= 3 && { top: 725 }, // Ajuste igual ao da primeira
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

            {/* Segunda Habilidade */}
            <TouchableOpacity
              style={[
                styles.secondSkillButton,
                isPreviewMode && styles.previewMode,
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

            {/* Dano da Segunda Habilidade */}
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

            {/* Décimo Segundo Botão (Custo de Recuo, ao lado da Resistência) */}
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

            {/* Quinto Botão Retangular (Para a curiosidade do Pokémon) */}
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

            {/* Sétimo Botão Retangular (Para o nome do Ilustrador) */}
            <TouchableOpacity
              style={[
                styles.illustrationButton,
                isPreviewMode && styles.previewMode,
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

            {/* Oitavo Botão Retangular (Para o número do Pokémon) */}
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

            {/* Nono Botão Retangular (Extra, centralizado horizontalmente) */}
            <TouchableOpacity
              style={[
                styles.extraInfoButton,
                isPreviewMode && styles.previewMode,
              ]}
              onPress={() => setExtraInfoModalVisible(true)}
              disabled={isPreviewMode}
            >
              {extraInfo ? (
                <Text style={styles.extraInfoText}>{extraInfo}</Text>
              ) : null}
            </TouchableOpacity>

            {/* Aqui dentro vão entrar os TextInputs flutuantes logo logo! */}
          </View>
        </View>

        {/* Modal embutido na tela que só aparece quando isTypeModalVisible for true */}
        <TypeModal
          visible={isTypeModalVisible}
          onClose={() => setTypeModalVisible(false)}
          onSelectType={(id) => {
            setCurrentTemplate(TEMPLATES[id]); // Troca a imagem da carta
            setTypeModalVisible(false); // Fecha o modal logo em seguida
          }}
        />

        {/* Modal de HP */}
        <HpModal
          visible={isHpModalVisible}
          onClose={() => setHpModalVisible(false)}
          onSave={(valor) => setHp(valor)}
        />

        {/* Modal de Nome */}
        <NameModal
          visible={isNameModalVisible}
          onClose={() => setNameModalVisible(false)}
          onSave={(valor) => setName(valor)}
        />

        {/* Modal de Descrição */}
        <DescriptionModal
          visible={isDescriptionModalVisible}
          onClose={() => setDescriptionModalVisible(false)}
          onSave={(valor) => setDescription(valor)}
        />

        {/* Modal de Curiosidade */}
        <CuriosityModal
          visible={isCuriosityModalVisible}
          onClose={() => setCuriosityModalVisible(false)}
          onSave={(valor) => setCuriosity(valor)}
        />

        {/* Modal de Ilustrador */}
        <IllustrationModal
          visible={isIllustrationModalVisible}
          onClose={() => setIllustrationModalVisible(false)}
          onSave={(valor) => setIllustration(valor)}
        />

        {/* Modal do Número do Pokémon */}
        <PokemonNumberModal
          visible={isPokemonNumberModalVisible}
          onClose={() => setPokemonNumberModalVisible(false)}
          onSave={(valor) => setPokemonNumber(valor)}
        />

        {/* Modal de Informação Extra */}
        <ExtraInfoModal
          visible={isExtraInfoModalVisible}
          onClose={() => setExtraInfoModalVisible(false)}
          onSave={(valor) => setExtraInfo(valor)}
        />

        {/* Modal de Fraqueza */}
        <WeaknessModal
          visible={isWeaknessModalVisible}
          onClose={() => setWeaknessModalVisible(false)}
          onSelectWeakness={(id) => {
            setWeakness(id);
            setWeaknessModalVisible(false);
          }}
        />

        {/* Modal de Resistência */}
        <ResistanceModal
          visible={isResistanceModalVisible}
          onClose={() => setResistanceModalVisible(false)}
          onSelectResistance={(id) => {
            setResistance(id);
            setResistanceModalVisible(false);
          }}
        />

        {/* Modal de Custo de Recuo */}
        <RetreatModal
          visible={isRetreatModalVisible}
          onClose={() => setRetreatModalVisible(false)}
          onSave={(symbol, count) => {
            setRetreat({ symbol, count });
            setRetreatModalVisible(false);
          }}
        />

        {/* Modal de Valor da Fraqueza */}
        <WeaknessValueModal
          visible={isWeaknessValueModalVisible}
          onClose={() => setWeaknessValueModalVisible(false)}
          onSave={(value) => {
            setWeaknessValue(value);
            setWeaknessValueModalVisible(false);
          }}
        />

        {/* Modal de Valor da Resistência */}
        <ResistanceValueModal
          visible={isResistanceValueModalVisible}
          onClose={() => setResistanceValueModalVisible(false)}
          onSave={(value) => {
            setResistanceValue(value);
            setResistanceValueModalVisible(false);
          }}
        />

        {/* Modal da Primeira Habilidade */}
        <SkillModal
          visible={isFirstSkillModalVisible}
          onClose={() => setFirstSkillModalVisible(false)}
          onSave={(skill) => {
            setFirstSkill(skill);
            setFirstSkillModalVisible(false);
          }}
          title="Primeira Habilidade"
        />

        {/* Modal do Dano da Primeira Habilidade */}
        <SkillDamageModal
          visible={isFirstSkillDamageModalVisible}
          onClose={() => setFirstSkillDamageModalVisible(false)}
          onSave={(value) => {
            setFirstSkillDamage(value);
            setFirstSkillDamageModalVisible(false);
          }}
        />

        {/* Modal do Custo de Energia da Primeira Habilidade */}
        <SkillEnergyModal
          visible={isFirstSkillEnergyModalVisible}
          onClose={() => setFirstSkillEnergyModalVisible(false)}
          onSave={(symbol, count) => {
            setFirstSkillEnergy({ symbol, count });
            setFirstSkillEnergyModalVisible(false);
          }}
        />

        {/* Modal da Segunda Habilidade */}
        <SkillModal
          visible={isSecondSkillModalVisible}
          onClose={() => setSecondSkillModalVisible(false)}
          onSave={(skill) => {
            setSecondSkill(skill);
            setSecondSkillModalVisible(false);
          }}
          title="Segunda Habilidade"
        />

        {/* Modal do Dano da Segunda Habilidade */}
        <SkillDamageModal
          visible={isSecondSkillDamageModalVisible}
          onClose={() => setSecondSkillDamageModalVisible(false)}
          onSave={(value) => {
            setSecondSkillDamage(value);
            setSecondSkillDamageModalVisible(false);
          }}
        />

        {/* Modal do Custo de Energia da Segunda Habilidade */}
        <SkillEnergyModal
          visible={isSecondSkillEnergyModalVisible}
          onClose={() => setSecondSkillEnergyModalVisible(false)}
          onSave={(symbol, count) => {
            setSecondSkillEnergy({ symbol, count });
            setSecondSkillEnergyModalVisible(false);
          }}
        />

        {/* Bottom Bar / Footer */}
        <View style={styles.footerBar}>
          <TouchableOpacity
            onPress={() => console.log("Voltar/Seta Esquerda")}
            disabled={isPreviewMode}
            style={{ opacity: isPreviewMode ? 0.3 : 1 }}
          >
            <Image
              source={require("../../../assets/images/icons/arrow_left.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Salvar")}
            disabled={isPreviewMode}
            style={{ opacity: isPreviewMode ? 0.3 : 1 }}
          >
            <Image
              source={require("../../../assets/images/icons/save.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsPreviewMode(!isPreviewMode)}>
            <Image
              source={require("../../../assets/images/icons/eye.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Avançar/Seta Direita")}
            disabled={isPreviewMode}
            style={{ opacity: isPreviewMode ? 0.3 : 1 }}
          >
            <Image
              source={require("../../../assets/images/icons/arrow_right.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>
        </View>
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

  hpButton: {
    position: "absolute",
    top: 70, // Mesmo alinhamento vertical da bolinha
    right: 130, // Fica à esquerda da bolinha (68 da margem + 60 da bolinha + 12 de espaço)
    width: 150, // Aumentei de 100 para 140 a seu pedido para dar espaço ao "120 HP"
    height: 50, // Mesma altura
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center", // Centraliza o texto verticalmente
    alignItems: "center", // Centraliza o texto horizontalmente
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

  // Dano da Primeira Habilidade (Ao lado direito)
  firstSkillDamageButton: {
    position: "absolute",
    top: 610, // Mesma altura da habilidade
    left: 630, // Valor provisório (à direita da habilidade)
    width: 70, // Valor provisório
    height: 70, // Mesma altura da habilidade
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
    height: 70,
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
    left: 107.5, // Ajustei -2.5px
    width: 45, // Tamanho que você queria no modo edição
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
    left: 155, // Valor provisório
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
    left: 45, // Valor provisório
    width: 140, // Valor provisório
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
    width: 450, // Pode mudar a largura à vontade agora
    height: 25, // Mesma altura do ilustrador
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center", // Puxa para o topo
    alignItems: "flex-start", // Puxa para a esquerda
    padding: 0, // Sem padding extra, texto encosta nas bordas
  },

  // Texto do HP (Usando a fonte personalizada)
  hpText: {
    fontFamily: "GillSans-Bold",
    fontSize: 45,
    color: "#000", // HP geralmente é preto ou bem escuro
    textAlign: "center",
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
    fontFamily: "GillSans",
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
    fontFamily: "GillSans",
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
    textAlign: "left",
    textShadowColor: "white",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false, // Remove padding nativo da fonte no Android
  },
});
