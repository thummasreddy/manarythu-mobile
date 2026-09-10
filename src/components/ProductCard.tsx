import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import type { Product } from "../api";
import { mocksEnabled } from "../api";
import { useAppStore } from "../store/app";
import { colors, radius, shadow } from "../theme";
import { Chip, Icon } from "./ui";

export function ProductCard({ product, wide = false }: { product: Product; wide?: boolean }) {
  const { i18n, t } = useTranslation();
  const locale = i18n.language === "te" ? "te" : "en";
  const add = useAppStore((s) => s.addToCart);
  const setQty = useAppStore((s) => s.setCartItemQty);
  const updateCart = useAppStore((s) => s.updateCart);
  const favorites = useAppStore((s) => s.favorites);
  const toggle = useAppStore((s) => s.toggleFavorite);

  const variant = product.defaultVariant;
  const off = variant.mrp > variant.sellingPrice
    ? Math.round(((variant.mrp - variant.sellingPrice) / variant.mrp) * 100)
    : 0;

  const localQty = useAppStore((s) => s.cart[product.id] ?? 0);
  const serverItem = useAppStore((s) =>
    s.serverCart?.items.find((i) => i.variantId === variant.id),
  );
  const qty = mocksEnabled ? localQty : (serverItem?.qty ?? 0);

  const onAdd = () => void add(product, variant.minOrderQty || 1);
  const onStep = (delta: number) => {
    if (mocksEnabled) {
      updateCart(product.id, qty + delta);
    } else if (serverItem) {
      void setQty(serverItem.id, qty + delta);
    }
  };

  return (
    <Pressable onPress={() => router.push(`/product/${product.slug}`)} style={[s.card, wide && { width: "100%" }]}>
      <View>
        <Image source={{ uri: product.imageUrl }} style={[s.image, wide && { width: "100%" }]} />
        <Pressable
          accessibilityLabel="Toggle favorite"
          hitSlop={10}
          onPress={(e) => { e.stopPropagation(); toggle(product.id); }}
          style={s.heart}
        >
          <Icon name={favorites.includes(product.id) ? "heart" : "heart-outline"} size={19} color={favorites.includes(product.id) ? colors.clay : colors.text} />
        </Pressable>
        {off > 0 && <View style={s.offBadge}><Text style={s.offText}>{off}% OFF</Text></View>}
        {!variant.inStock && (
          <View style={s.oos}><Text style={s.oosText}>{t("outOfStock")}</Text></View>
        )}
      </View>
      <View style={s.body}>
        <Chip>{product.organicCertified ? t("organic") : t("natural")}</Chip>
        <Text numberOfLines={2} style={s.name}>{product.name[locale]}</Text>
        <Text numberOfLines={1} style={s.farmer}>{t("by")} {product.farmer.farmerName}</Text>
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <View style={s.priceRow}>
              <Text style={s.price}>₹{variant.sellingPrice}</Text>
              {off > 0 && <Text style={s.mrp}>₹{variant.mrp}</Text>}
            </View>
            <Text style={s.unit}>{variant.label}</Text>
            {off > 0 && (
              <Text style={s.save}>{t("save")} ₹{variant.mrp - variant.sellingPrice}</Text>
            )}
          </View>
          {qty === 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${t("add")} ${product.name[locale]}`}
              disabled={!variant.inStock}
              onPress={(e) => { e.stopPropagation(); onAdd(); }}
              style={[s.add, !variant.inStock && { opacity: 0.4 }]}
            >
              <Icon name="add" color={colors.white} />
            </Pressable>
          ) : (
            <View style={s.stepper}>
              <Pressable accessibilityRole="button" accessibilityLabel="Decrease quantity" onPress={(e) => { e.stopPropagation(); onStep(-1); }} style={s.stepBtn} hitSlop={6}>
                <Icon name="remove" size={16} color={colors.primary} />
              </Pressable>
              <Text style={s.stepQty}>{qty}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Increase quantity" disabled={qty >= variant.maxOrderQty || qty >= variant.availableQty} onPress={(e) => { e.stopPropagation(); onStep(1); }} style={s.stepBtn} hitSlop={6}>
                <Icon name="add" size={16} color={qty >= variant.maxOrderQty || qty >= variant.availableQty ? colors.disabled : colors.primary} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { width: 190, borderRadius: radius.lg, backgroundColor: colors.white, overflow: "hidden", ...shadow },
  image: { width: 190, height: 140, backgroundColor: colors.primarySoft },
  heart: { position: "absolute", right: 10, top: 10, backgroundColor: colors.white, borderRadius: 20, padding: 7 },
  offBadge: { position: "absolute", left: 10, top: 10, backgroundColor: colors.clay, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  offText: { color: colors.white, fontSize: 10, fontWeight: "800" },
  oos: { position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.75)", alignItems: "center", justifyContent: "center" },
  oosText: { color: colors.primaryDark, fontWeight: "800", fontSize: 12 },
  body: { padding: 13, gap: 8, alignItems: "flex-start" },
  name: { fontWeight: "800", color: colors.text, fontSize: 16, minHeight: 39 },
  farmer: { color: colors.muted, fontSize: 12 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  price: { color: colors.text, fontWeight: "800", fontSize: 17 },
  mrp: { color: colors.muted, fontSize: 12, textDecorationLine: "line-through" },
  unit: { color: colors.muted, fontSize: 11 },
  save: { color: colors.clay, fontSize: 11, fontWeight: "700", marginTop: 2 },
  add: { backgroundColor: colors.primary, borderRadius: 13, padding: 7 },
  stepper: { flexDirection: "row", alignItems: "center", borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  stepBtn: { paddingHorizontal: 8, paddingVertical: 7 },
  stepQty: { minWidth: 22, textAlign: "center", fontWeight: "800", color: colors.text, fontSize: 14 },
});
