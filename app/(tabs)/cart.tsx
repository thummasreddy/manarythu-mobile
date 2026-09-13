import { router } from "expo-router";
import { useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { mocksEnabled, type CartItem } from "../../src/api";
import { products } from "../../src/api/mock";
import { Button, ScreenTitle, StateView } from "../../src/components/ui";
import { useAppStore } from "../../src/store/app";
import { colors, radius } from "../../src/theme";

export default function Cart() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "te" ? "te" : "en";
  const localCart = useAppStore((s) => s.cart);
  const updateLocal = useAppStore((s) => s.updateCart);
  const serverCart = useAppStore((s) => s.serverCart);
  const refreshCart = useAppStore((s) => s.refreshCart);
  const setCartItemQty = useAppStore((s) => s.setCartItemQty);
  const cartBusy = useAppStore((s) => s.cartBusy);

  useEffect(() => {
    void refreshCart().catch(() => {});
  }, [refreshCart]);

  if (!mocksEnabled) {
    const items = serverCart?.items ?? [];
    return (
      <ScrollView contentContainerStyle={s.page}>
        <ScreenTitle title={t("cart")} subtitle={`${serverCart?.totalItems ?? 0} farm-fresh selections`} />
        {!serverCart ? (
          <StateView state={cartBusy ? "loading" : "error"} onRetry={() => void refreshCart()} />
        ) : !items.length ? (
          <StateView state="empty" message="Your basket is ready for something fresh." />
        ) : (
          <>
            {items.map((item) => (
              <ServerRow key={item.id} item={item} locale={locale} busy={cartBusy}
                onQty={(qty) => void setCartItemQty(item.id, qty)} />
            ))}
            <View style={s.bill}>
              <Row label={t("subtotal")} value={`₹${serverCart.subtotal}`} />
              {serverCart.totalSavings > 0 && <Row label="Savings" value={`−₹${serverCart.totalSavings}`} />}
              <View style={s.line} />
              <Row label={t("total")} value={`₹${serverCart.subtotal}`} bold />
            </View>
            <Button onPress={() => router.push("/checkout")}>{t("checkout")}</Button>
          </>
        )}
      </ScrollView>
    );
  }

  const items = products.filter((p) => localCart[p.id]).map((p) => ({ p, qty: localCart[p.id]! }));
  const subtotal = items.reduce((a, x) => a + x.p.defaultVariant.sellingPrice * x.qty, 0);
  return (
    <ScrollView contentContainerStyle={s.page}>
      <ScreenTitle title={t("cart")} subtitle={`${items.length} farm-fresh selections`} />
      {!items.length ? (
        <StateView state="empty" message="Your basket is ready for something fresh." />
      ) : (
        <>
          {items.map(({ p, qty }) => (
            <View key={p.id} style={s.item}>
              <Image source={{ uri: p.imageUrl }} style={s.image} />
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{p.name[locale]}</Text>
                <Text style={s.muted}>{p.defaultVariant.label} · {p.farmer.farmerName}</Text>
                <Text style={s.price}>₹{p.defaultVariant.sellingPrice * qty}</Text>
              </View>
              <View style={s.stepper}>
                <Button variant="ghost" onPress={() => updateLocal(p.id, qty - 1)}>−</Button>
                <Text style={s.qty}>{qty}</Text>
                <Button variant="ghost" onPress={() => updateLocal(p.id, qty + 1)}>+</Button>
              </View>
            </View>
          ))}
          <View style={s.bill}>
            <Row label={t("subtotal")} value={`₹${subtotal}`} />
            <Row label={t("delivery")} value={subtotal >= 299 ? "FREE" : "₹40"} />
            <View style={s.line} />
            <Row label={t("total")} value={`₹${subtotal + (subtotal >= 299 ? 0 : 40)}`} bold />
          </View>
          <Button onPress={() => router.push("/checkout")}>{t("checkout")}</Button>
        </>
      )}
    </ScrollView>
  );
}

function ServerRow({ item, locale, busy, onQty }: { item: CartItem; locale: "en" | "te"; busy: boolean; onQty: (qty: number) => void }) {
  return (
    <View style={s.item}>
      {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={s.image} /> : <View style={[s.image, { backgroundColor: colors.primarySoft }]} />}
      <View style={{ flex: 1 }}>
        <Text style={s.name} numberOfLines={2}>{item.productName[locale] ?? item.productName.en}</Text>
        <Text style={s.muted}>{item.variantLabel} · {item.farmerName}</Text>
        <Text style={s.price}>₹{item.lineTotal}</Text>
      </View>
      <View style={s.stepper}>
        <Button variant="ghost" disabled={busy} onPress={() => onQty(item.qty - 1)}>−</Button>
        <Text style={s.qty}>{item.qty}</Text>
        <Button variant="ghost" disabled={busy} onPress={() => onQty(item.qty + 1)}>+</Button>
      </View>
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <View style={s.row}><Text style={[s.muted, bold && s.name]}>{label}</Text><Text style={[s.price, bold && { fontSize: 19 }]}>{value}</Text></View>;
}

const s = StyleSheet.create({ page: { padding: 18, paddingTop: 56, gap: 16 }, item: { flexDirection: "row", padding: 12, gap: 12, borderRadius: radius.lg, backgroundColor: colors.white, alignItems: "center" }, image: { width: 76, height: 76, borderRadius: radius.md }, name: { fontWeight: "800", color: colors.text }, muted: { color: colors.muted, marginTop: 4 }, price: { fontWeight: "800", color: colors.text, marginTop: 5 }, stepper: { alignItems: "center", gap: 3 }, qty: { fontWeight: "800", color: colors.text }, bill: { backgroundColor: colors.cream, borderRadius: radius.lg, padding: 18, gap: 12 }, row: { flexDirection: "row", justifyContent: "space-between" }, line: { height: 1, backgroundColor: colors.border } });
