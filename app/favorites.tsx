import { FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { products } from "../src/api/mock";
import { ProductCard } from "../src/components/ProductCard";
import { StateView } from "../src/components/ui";
import { useAppStore } from "../src/store/app";
export default function Favorites() { const { t } = useTranslation(); const ids = useAppStore((s) => s.favorites); const data = products.filter((p) => ids.includes(p.id)); if (!data.length) return <StateView state="empty" message={t("empty")} />; return <FlatList data={data} numColumns={2} columnWrapperStyle={s.grid} contentContainerStyle={s.page} renderItem={({ item }) => <View style={s.item}><ProductCard product={item} wide /></View>} />; }
const s = StyleSheet.create({ page: { padding: 14 }, grid: { gap: 12 }, item: { flex: 1, maxWidth: "49%", marginBottom: 14 } });
