import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { api } from "../../src/api";
import { ProductCard } from "../../src/components/ProductCard";
import { StateView } from "../../src/components/ui";
export default function Category() { const { slug } = useLocalSearchParams<{ slug: string }>(); const query = useQuery({ queryKey: ["products", slug], queryFn: () => api.products({ category: slug }) }); if (query.isLoading) return <StateView state="loading" />; if (!query.data?.length) return <StateView state="empty" />; return <FlatList data={query.data} numColumns={2} keyExtractor={(p) => p.id} columnWrapperStyle={s.grid} contentContainerStyle={s.page} renderItem={({ item }) => <View style={s.item}><ProductCard product={item} wide /></View>} />; }
const s = StyleSheet.create({ page: { padding: 14 }, grid: { gap: 12 }, item: { flex: 1, maxWidth: "49%", marginBottom: 14 } });
