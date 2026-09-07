import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { resources } from "./resources";
const device = Localization.getLocales()[0]?.languageCode === "te" ? "te" : "en";
void i18n.use(initReactI18next).init({ resources, lng: device, fallbackLng: "en", interpolation: { escapeValue: false } });
export default i18n;
