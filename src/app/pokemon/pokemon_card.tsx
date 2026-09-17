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
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [currentTemplate, setCurrentTemplate] = useState(TEMPLATES.normal);
  const [hp, setHp] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [curiosity, setCuriosity] = useState("");
  const [illustration, setIllustration] = useState("");
  const [pokemonNumber, setPokemonNumber] = useState("");
  const [extraInfo, setExtraInfo] = useState("");

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
              onPress={() => console.log("Clicou no botão de imagem!")}
              disabled={isPreviewMode}
            >
              {!isPreviewMode && (
                <Text style={styles.imageButtonText}>
                  Clique aqui para{"\n"}adicionar uma imagem
                </Text>
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
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
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
  },
});
