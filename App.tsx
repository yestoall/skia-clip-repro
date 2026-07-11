// Minimal repro: the first two Skia Canvas instances in a subtree draw
// clipped at the bottom (~5% of the canvas height) on iOS + new architecture.
import { Canvas, Path } from "@shopify/react-native-skia"
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native"

const W = Dimensions.get("window").width - 32
const H = 96
const R = 24

const roundedRect = (w: number, h: number, r: number, inset = 0) => {
  const l = inset
  const t = inset
  const rt = w - inset
  const b = h - inset
  const rr = r - inset
  return [
    `M ${l + rr} ${t}`,
    `L ${rt - rr} ${t}`,
    `Q ${rt} ${t} ${rt} ${t + rr}`,
    `L ${rt} ${b - rr}`,
    `Q ${rt} ${b} ${rt - rr} ${b}`,
    `L ${l + rr} ${b}`,
    `Q ${l} ${b} ${l} ${b - rr}`,
    `L ${l} ${t + rr}`,
    `Q ${l} ${t} ${l + rr} ${t}`,
    "Z",
  ].join(" ")
}

// rounded fill reaching the canvas bottom — clipped on the first two cards
const FILL = roundedRect(W, H, R)
// bottom edge stroke — invisible on the first two cards
const BOTTOM = `M ${R} ${H - 1.5} L ${W - R} ${H - 1.5}`
// reference rect 1px inside the canvas bounds — renders fully on ALL cards
const REF = `M 1 1 L ${W - 1} 1 L ${W - 1} ${H - 1} L 1 ${H - 1} Z`

const Card = ({ index }: { index: number }) => (
  <View style={styles.card}>
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Path path={FILL} color="#1E5B75" />
      <Path path={BOTTOM} style="stroke" strokeWidth={3} color="white" />
      <Path path={REF} style="stroke" strokeWidth={1} color="lime" />
    </Canvas>
    <Text style={styles.label}>Canvas #{index + 1}</Text>
  </View>
)

export default function App() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} index={i} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0E4A63" },
  content: { padding: 16, paddingTop: 80 },
  card: { height: H, marginBottom: 12 },
  label: { color: "white", textAlign: "center", marginTop: 38, fontSize: 16 },
})
