/**
 * HUB page translations per locale.
 * Used by the auto-generator in pageResolver to create localized HUB pages
 * from the English canonical pages.
 *
 * Key = toolId (matches toolRegistry.ts)
 * Each entry has: h1, metaTitle, metaDesc per locale.
 */

import type { Locale } from './i18n';

export interface HubTranslation {
  h1: string;
  metaTitle: string;
  metaDesc: string;
}

/**
 * Add new locales incrementally. Only locales with entries here
 * will get auto-generated HUB pages.
 */
export const hubTranslations: Record<string, Partial<Record<Locale, HubTranslation>>> = {
  svg_vectorizer: {
    fr: {
      h1: 'Convertir PNG en SVG — Vectoriseur en ligne gratuit',
      metaTitle: 'PNG en SVG | Gratuit, Privé, Instantané | BestOnline.Tools',
      metaDesc: 'Convertissez vos images PNG, JPG ou WebP en SVG. 100% dans votre navigateur — vos fichiers ne quittent jamais votre appareil.',
    },
    es: {
      h1: 'Convertir PNG a SVG — Vectorizador en línea gratuito',
      metaTitle: 'PNG a SVG | Gratis, Privado, Instantáneo | BestOnline.Tools',
      metaDesc: 'Convierta imágenes PNG, JPG o WebP a formato SVG. 100% en su navegador — sus archivos nunca salen de su dispositivo.',
    },
    it: {
      h1: 'Convertire PNG in SVG — Vettorizzatore online gratuito',
      metaTitle: 'PNG in SVG | Gratuito, Privato, Istantaneo | BestOnline.Tools',
      metaDesc: 'Convertite immagini PNG, JPG o WebP in SVG. 100% nel vostro browser — i file non lasciano mai il dispositivo.',
    },
    nl: {
      h1: 'PNG naar SVG converteren — Gratis online vectorizer',
      metaTitle: 'PNG naar SVG | Gratis, Privé, Direct | BestOnline.Tools',
      metaDesc: 'Converteer PNG-, JPG- of WebP-afbeeldingen naar SVG. 100% in uw browser — bestanden verlaten nooit uw apparaat.',
    },
    pt: {
      h1: 'Converter PNG para SVG — Vetorizador online gratuito',
      metaTitle: 'PNG para SVG | Gratuito, Privado, Instantâneo | BestOnline.Tools',
      metaDesc: 'Converta imagens PNG, JPG ou WebP para SVG. 100% no seu navegador — os ficheiros nunca saem do dispositivo.',
    },
    pl: {
      h1: 'Konwertuj PNG na SVG — Darmowy wektoryzator online',
      metaTitle: 'PNG na SVG | Darmowy, Prywatny | BestOnline.Tools',
      metaDesc: 'Konwertuj obrazy PNG, JPG lub WebP na SVG. 100% w przeglądarce — pliki nigdy nie opuszczają urządzenia.',
    },
    sv: {
      h1: 'Konvertera PNG till SVG — Gratis online-vektorisering',
      metaTitle: 'PNG till SVG | Gratis, Privat, Direkt | BestOnline.Tools',
      metaDesc: 'Konvertera PNG-, JPG- eller WebP-bilder till SVG. 100% i din webbläsare — filerna lämnar aldrig din enhet.',
    },
    ja: {
      h1: 'PNGをSVGに変換 — 無料オンラインベクタライザー',
      metaTitle: 'PNG→SVG変換 | 無料・プライベート | BestOnline.Tools',
      metaDesc: 'PNG、JPG、WebP画像をSVGに変換。100%ブラウザ内処理 — ファイルがデバイスを離れることはありません。',
    },
  },
  remove_bg: {
    fr: {
      h1: 'Supprimer l\'arrière-plan — IA gratuite et privée',
      metaTitle: 'Supprimer arrière-plan | IA gratuite, sans téléchargement | BestOnline.Tools',
      metaDesc: 'Supprimez l\'arrière-plan de vos photos avec l\'IA. 100% dans votre navigateur — aucun fichier téléchargé sur un serveur.',
    },
    es: {
      h1: 'Eliminar fondo de imagen — IA gratuita y privada',
      metaTitle: 'Eliminar fondo | IA gratuita, sin subir archivos | BestOnline.Tools',
      metaDesc: 'Elimine el fondo de sus fotos con IA. 100% en su navegador — ningún archivo se sube a un servidor.',
    },
    it: {
      h1: 'Rimuovere lo sfondo — IA gratuita e privata',
      metaTitle: 'Rimuovere sfondo | IA gratuita, senza upload | BestOnline.Tools',
      metaDesc: 'Rimuovete lo sfondo dalle foto con l\'IA. 100% nel browser — nessun file caricato su server.',
    },
    nl: {
      h1: 'Achtergrond verwijderen — Gratis AI, privé',
      metaTitle: 'Achtergrond verwijderen | Gratis AI, geen upload | BestOnline.Tools',
      metaDesc: 'Verwijder de achtergrond van foto\'s met AI. 100% in uw browser — geen bestanden geüpload.',
    },
    pt: {
      h1: 'Remover fundo de imagem — IA gratuita e privada',
      metaTitle: 'Remover fundo | IA gratuita, sem upload | BestOnline.Tools',
      metaDesc: 'Remova o fundo das suas fotos com IA. 100% no navegador — nenhum ficheiro enviado.',
    },
    pl: {
      h1: 'Usuń tło ze zdjęcia — Darmowa AI',
      metaTitle: 'Usuń tło | Darmowa AI, bez przesyłania | BestOnline.Tools',
      metaDesc: 'Usuń tło ze zdjęć za pomocą AI. 100% w przeglądarce — żadne pliki nie są przesyłane.',
    },
    sv: {
      h1: 'Ta bort bakgrund — Gratis AI, privat',
      metaTitle: 'Ta bort bakgrund | Gratis AI, ingen uppladdning | BestOnline.Tools',
      metaDesc: 'Ta bort bakgrunden från foton med AI. 100% i din webbläsare — inga filer laddas upp.',
    },
    ja: {
      h1: '背景を削除 — 無料AIツール',
      metaTitle: '背景削除 | 無料AI、アップロード不要 | BestOnline.Tools',
      metaDesc: 'AIで写真の背景を削除。100%ブラウザ内処理 — ファイルはアップロードされません。',
    },
  },
  pdf_merge: {
    fr: {
      h1: 'Fusionner PDF — Gratuit et privé',
      metaTitle: 'Fusionner PDF | Gratuit, sans téléchargement | BestOnline.Tools',
      metaDesc: 'Combinez plusieurs fichiers PDF en un seul. 100% dans votre navigateur — aucun fichier téléchargé.',
    },
    es: {
      h1: 'Unir PDF — Gratuito y privado',
      metaTitle: 'Unir PDF | Gratis, sin subir archivos | BestOnline.Tools',
      metaDesc: 'Combine múltiples archivos PDF en uno solo. 100% en su navegador — sin subir archivos.',
    },
    it: {
      h1: 'Unire PDF — Gratuito e privato',
      metaTitle: 'Unire PDF | Gratuito, senza upload | BestOnline.Tools',
      metaDesc: 'Combinate più file PDF in uno solo. 100% nel browser — nessun file caricato.',
    },
    nl: {
      h1: 'PDF samenvoegen — Gratis en privé',
      metaTitle: 'PDF samenvoegen | Gratis, geen upload | BestOnline.Tools',
      metaDesc: 'Combineer meerdere PDF-bestanden tot één. 100% in uw browser — geen bestanden geüpload.',
    },
    pt: {
      h1: 'Juntar PDF — Gratuito e privado',
      metaTitle: 'Juntar PDF | Gratuito, sem upload | BestOnline.Tools',
      metaDesc: 'Combine vários ficheiros PDF num só. 100% no navegador — sem upload.',
    },
    pl: {
      h1: 'Połącz pliki PDF — Darmowe i prywatne',
      metaTitle: 'Połącz PDF | Darmowe, bez przesyłania | BestOnline.Tools',
      metaDesc: 'Połącz wiele plików PDF w jeden. 100% w przeglądarce — bez przesyłania.',
    },
    sv: {
      h1: 'Slå ihop PDF — Gratis och privat',
      metaTitle: 'Slå ihop PDF | Gratis, ingen uppladdning | BestOnline.Tools',
      metaDesc: 'Kombinera flera PDF-filer till en. 100% i din webbläsare — ingen uppladdning.',
    },
    ja: {
      h1: 'PDF結合 — 無料・プライベート',
      metaTitle: 'PDF結合 | 無料、アップロード不要 | BestOnline.Tools',
      metaDesc: '複数のPDFファイルを1つに結合。100%ブラウザ内処理 — アップロード不要。',
    },
  },
  pdf_split: {
    fr: {
      h1: 'Diviser PDF — Gratuit et privé',
      metaTitle: 'Diviser PDF | Gratuit, sans téléchargement | BestOnline.Tools',
      metaDesc: 'Divisez un PDF par pages ou plages. 100% dans votre navigateur — vos fichiers restent privés.',
    },
    es: {
      h1: 'Dividir PDF — Gratuito y privado',
      metaTitle: 'Dividir PDF | Gratis, sin subir archivos | BestOnline.Tools',
      metaDesc: 'Divida un PDF por páginas o rangos. 100% en su navegador — sus archivos permanecen privados.',
    },
    it: {
      h1: 'Dividere PDF — Gratuito e privato',
      metaTitle: 'Dividere PDF | Gratuito, senza upload | BestOnline.Tools',
      metaDesc: 'Dividete un PDF per pagine o intervalli. 100% nel browser — i file restano privati.',
    },
    nl: {
      h1: 'PDF splitsen — Gratis en privé',
      metaTitle: 'PDF splitsen | Gratis, geen upload | BestOnline.Tools',
      metaDesc: 'Splits een PDF per pagina of bereik. 100% in uw browser — bestanden blijven privé.',
    },
    pt: {
      h1: 'Dividir PDF — Gratuito e privado',
      metaTitle: 'Dividir PDF | Gratuito, sem upload | BestOnline.Tools',
      metaDesc: 'Divida um PDF por páginas ou intervalos. 100% no navegador — ficheiros privados.',
    },
    pl: {
      h1: 'Podziel PDF — Darmowe i prywatne',
      metaTitle: 'Podziel PDF | Darmowe, bez przesyłania | BestOnline.Tools',
      metaDesc: 'Podziel PDF na strony lub zakresy. 100% w przeglądarce — pliki prywatne.',
    },
    sv: {
      h1: 'Dela PDF — Gratis och privat',
      metaTitle: 'Dela PDF | Gratis, ingen uppladdning | BestOnline.Tools',
      metaDesc: 'Dela en PDF per sida eller intervall. 100% i din webbläsare — filerna förblir privata.',
    },
    ja: {
      h1: 'PDF分割 — 無料・プライベート',
      metaTitle: 'PDF分割 | 無料、アップロード不要 | BestOnline.Tools',
      metaDesc: 'PDFをページや範囲で分割。100%ブラウザ内処理 — プライベート。',
    },
  },
  image_compressor: {
    fr: {
      h1: 'Compresser des images — Gratuit et privé',
      metaTitle: 'Compresseur d\'images | Gratuit, sans téléchargement | BestOnline.Tools',
      metaDesc: 'Réduisez la taille de vos images PNG, JPG et WebP. 100% dans votre navigateur.',
    },
    es: {
      h1: 'Comprimir imágenes — Gratuito y privado',
      metaTitle: 'Compresor de imágenes | Gratis, sin subir archivos | BestOnline.Tools',
      metaDesc: 'Reduzca el tamaño de sus imágenes PNG, JPG y WebP. 100% en su navegador.',
    },
    it: {
      h1: 'Comprimere immagini — Gratuito e privato',
      metaTitle: 'Compressore immagini | Gratuito, senza upload | BestOnline.Tools',
      metaDesc: 'Riducete le dimensioni delle immagini PNG, JPG e WebP. 100% nel browser.',
    },
    nl: {
      h1: 'Afbeeldingen comprimeren — Gratis en privé',
      metaTitle: 'Afbeelding comprimeren | Gratis, geen upload | BestOnline.Tools',
      metaDesc: 'Verklein PNG-, JPG- en WebP-afbeeldingen. 100% in uw browser.',
    },
    pt: {
      h1: 'Comprimir imagens — Gratuito e privado',
      metaTitle: 'Compressor de imagens | Gratuito, sem upload | BestOnline.Tools',
      metaDesc: 'Reduza o tamanho de imagens PNG, JPG e WebP. 100% no navegador.',
    },
    pl: {
      h1: 'Kompresuj obrazy — Darmowe i prywatne',
      metaTitle: 'Kompresor obrazów | Darmowy, bez przesyłania | BestOnline.Tools',
      metaDesc: 'Zmniejsz rozmiar obrazów PNG, JPG i WebP. 100% w przeglądarce.',
    },
    sv: {
      h1: 'Komprimera bilder — Gratis och privat',
      metaTitle: 'Bildkomprimerare | Gratis, ingen uppladdning | BestOnline.Tools',
      metaDesc: 'Minska storleken på PNG-, JPG- och WebP-bilder. 100% i din webbläsare.',
    },
    ja: {
      h1: '画像圧縮 — 無料・プライベート',
      metaTitle: '画像圧縮 | 無料、アップロード不要 | BestOnline.Tools',
      metaDesc: 'PNG、JPG、WebP画像のサイズを縮小。100%ブラウザ内処理。',
    },
  },
  coloring_page: {
    fr: {
      h1: 'Photo en coloriage — Gratuit et privé',
      metaTitle: 'Photo en coloriage | Gratuit, sans téléchargement | BestOnline.Tools',
      metaDesc: 'Transformez vos photos en pages de coloriage. 100% dans votre navigateur.',
    },
    es: {
      h1: 'Foto para colorear — Gratuito y privado',
      metaTitle: 'Foto para colorear | Gratis, sin subir archivos | BestOnline.Tools',
      metaDesc: 'Transforme sus fotos en páginas para colorear. 100% en su navegador.',
    },
    it: {
      h1: 'Foto da colorare — Gratuito e privato',
      metaTitle: 'Foto da colorare | Gratuito, senza upload | BestOnline.Tools',
      metaDesc: 'Trasformate le foto in pagine da colorare. 100% nel browser.',
    },
    nl: {
      h1: 'Foto naar kleurplaat — Gratis en privé',
      metaTitle: 'Foto naar kleurplaat | Gratis, geen upload | BestOnline.Tools',
      metaDesc: 'Maak van foto\'s kleurplaten. 100% in uw browser.',
    },
    pt: {
      h1: 'Foto para colorir — Gratuito e privado',
      metaTitle: 'Foto para colorir | Gratuito, sem upload | BestOnline.Tools',
      metaDesc: 'Transforme fotos em páginas para colorir. 100% no navegador.',
    },
    pl: {
      h1: 'Zdjęcie do kolorowania — Darmowe i prywatne',
      metaTitle: 'Zdjęcie do kolorowania | Darmowe, bez przesyłania | BestOnline.Tools',
      metaDesc: 'Zamień zdjęcia na strony do kolorowania. 100% w przeglądarce.',
    },
    sv: {
      h1: 'Foto till målarbok — Gratis och privat',
      metaTitle: 'Foto till målarbok | Gratis, ingen uppladdning | BestOnline.Tools',
      metaDesc: 'Förvandla foton till målarsidor. 100% i din webbläsare.',
    },
    ja: {
      h1: '写真をぬり絵に変換 — 無料・プライベート',
      metaTitle: 'ぬり絵作成 | 無料、アップロード不要 | BestOnline.Tools',
      metaDesc: '写真をぬり絵ページに変換。100%ブラウザ内処理。',
    },
  },
  audio_converter: {
    fr: {
      h1: 'Convertisseur audio — Gratuit et privé',
      metaTitle: 'Convertisseur audio | MP3, WAV, OGG, FLAC | BestOnline.Tools',
      metaDesc: 'Convertissez vos fichiers audio entre MP3, WAV, OGG, FLAC et AAC. 100% dans votre navigateur.',
    },
    es: {
      h1: 'Conversor de audio — Gratuito y privado',
      metaTitle: 'Conversor de audio | MP3, WAV, OGG, FLAC | BestOnline.Tools',
      metaDesc: 'Convierta archivos de audio entre MP3, WAV, OGG, FLAC y AAC. 100% en su navegador.',
    },
    it: {
      h1: 'Convertitore audio — Gratuito e privato',
      metaTitle: 'Convertitore audio | MP3, WAV, OGG, FLAC | BestOnline.Tools',
      metaDesc: 'Convertite file audio tra MP3, WAV, OGG, FLAC e AAC. 100% nel browser.',
    },
    nl: {
      h1: 'Audio converter — Gratis en privé',
      metaTitle: 'Audio converter | MP3, WAV, OGG, FLAC | BestOnline.Tools',
      metaDesc: 'Converteer audiobestanden tussen MP3, WAV, OGG, FLAC en AAC. 100% in uw browser.',
    },
    pt: {
      h1: 'Conversor de áudio — Gratuito e privado',
      metaTitle: 'Conversor de áudio | MP3, WAV, OGG, FLAC | BestOnline.Tools',
      metaDesc: 'Converta ficheiros de áudio entre MP3, WAV, OGG, FLAC e AAC. 100% no navegador.',
    },
    pl: {
      h1: 'Konwerter audio — Darmowy i prywatny',
      metaTitle: 'Konwerter audio | MP3, WAV, OGG, FLAC | BestOnline.Tools',
      metaDesc: 'Konwertuj pliki audio między MP3, WAV, OGG, FLAC i AAC. 100% w przeglądarce.',
    },
    sv: {
      h1: 'Ljudkonverterare — Gratis och privat',
      metaTitle: 'Ljudkonverterare | MP3, WAV, OGG, FLAC | BestOnline.Tools',
      metaDesc: 'Konvertera ljudfiler mellan MP3, WAV, OGG, FLAC och AAC. 100% i din webbläsare.',
    },
    ja: {
      h1: 'オーディオ変換 — 無料・プライベート',
      metaTitle: 'オーディオ変換 | MP3, WAV, OGG, FLAC | BestOnline.Tools',
      metaDesc: 'MP3、WAV、OGG、FLAC、AAC間でオーディオファイルを変換。100%ブラウザ内処理。',
    },
  },
  speech_to_text: {
    fr: {
      h1: 'Transcription audio — IA Whisper gratuite',
      metaTitle: 'Transcription audio | IA Whisper gratuite | BestOnline.Tools',
      metaDesc: 'Transcrivez vos fichiers audio en texte avec Whisper AI. 100% dans votre navigateur — aucun téléchargement.',
    },
    es: {
      h1: 'Transcripción de audio — IA Whisper gratuita',
      metaTitle: 'Transcripción de audio | IA Whisper gratuita | BestOnline.Tools',
      metaDesc: 'Transcriba archivos de audio a texto con Whisper AI. 100% en su navegador — sin subir archivos.',
    },
    it: {
      h1: 'Trascrizione audio — IA Whisper gratuita',
      metaTitle: 'Trascrizione audio | IA Whisper gratuita | BestOnline.Tools',
      metaDesc: 'Trascrivete file audio in testo con Whisper AI. 100% nel browser — senza upload.',
    },
    nl: {
      h1: 'Spraak naar tekst — Gratis Whisper AI',
      metaTitle: 'Spraak naar tekst | Gratis Whisper AI | BestOnline.Tools',
      metaDesc: 'Transcribeer audiobestanden naar tekst met Whisper AI. 100% in uw browser — geen upload.',
    },
    pt: {
      h1: 'Transcrição de áudio — IA Whisper gratuita',
      metaTitle: 'Transcrição de áudio | IA Whisper gratuita | BestOnline.Tools',
      metaDesc: 'Transcreva ficheiros de áudio para texto com Whisper AI. 100% no navegador — sem upload.',
    },
    pl: {
      h1: 'Transkrypcja audio — Darmowa AI Whisper',
      metaTitle: 'Transkrypcja audio | Darmowa AI Whisper | BestOnline.Tools',
      metaDesc: 'Transkrybuj pliki audio na tekst z Whisper AI. 100% w przeglądarce — bez przesyłania.',
    },
    sv: {
      h1: 'Tal till text — Gratis Whisper AI',
      metaTitle: 'Tal till text | Gratis Whisper AI | BestOnline.Tools',
      metaDesc: 'Transkribera ljudfiler till text med Whisper AI. 100% i din webbläsare — ingen uppladdning.',
    },
    ja: {
      h1: '音声文字起こし — 無料Whisper AI',
      metaTitle: '音声文字起こし | 無料Whisper AI | BestOnline.Tools',
      metaDesc: 'Whisper AIで音声ファイルをテキストに変換。100%ブラウザ内処理 — アップロード不要。',
    },
  },
  image_converter: {
    fr: {
      h1: 'Convertisseur de format d\'image — Gratuit et privé',
      metaTitle: 'Convertisseur d\'images | HEIC, WebP, AVIF en JPG, PNG | BestOnline.Tools',
      metaDesc: 'Convertissez HEIC, WebP, AVIF en JPG, PNG ou WebP. 100% dans votre navigateur.',
    },
    es: {
      h1: 'Conversor de formato de imagen — Gratuito y privado',
      metaTitle: 'Conversor de imágenes | HEIC, WebP, AVIF a JPG, PNG | BestOnline.Tools',
      metaDesc: 'Convierta HEIC, WebP, AVIF a JPG, PNG o WebP. 100% en su navegador.',
    },
    it: {
      h1: 'Convertitore formato immagine — Gratuito e privato',
      metaTitle: 'Convertitore immagini | HEIC, WebP, AVIF in JPG, PNG | BestOnline.Tools',
      metaDesc: 'Convertite HEIC, WebP, AVIF in JPG, PNG o WebP. 100% nel browser.',
    },
    nl: {
      h1: 'Afbeeldingsformaat converter — Gratis en privé',
      metaTitle: 'Afbeelding converter | HEIC, WebP, AVIF naar JPG, PNG | BestOnline.Tools',
      metaDesc: 'Converteer HEIC, WebP, AVIF naar JPG, PNG of WebP. 100% in uw browser.',
    },
    pt: {
      h1: 'Conversor de formato de imagem — Gratuito e privado',
      metaTitle: 'Conversor de imagens | HEIC, WebP, AVIF para JPG, PNG | BestOnline.Tools',
      metaDesc: 'Converta HEIC, WebP, AVIF para JPG, PNG ou WebP. 100% no navegador.',
    },
    pl: {
      h1: 'Konwerter formatu obrazów — Darmowy i prywatny',
      metaTitle: 'Konwerter obrazów | HEIC, WebP, AVIF na JPG, PNG | BestOnline.Tools',
      metaDesc: 'Konwertuj HEIC, WebP, AVIF na JPG, PNG lub WebP. 100% w przeglądarce.',
    },
    sv: {
      h1: 'Bildformatkonverterare — Gratis och privat',
      metaTitle: 'Bildkonverterare | HEIC, WebP, AVIF till JPG, PNG | BestOnline.Tools',
      metaDesc: 'Konvertera HEIC, WebP, AVIF till JPG, PNG eller WebP. 100% i din webbläsare.',
    },
    ja: {
      h1: '画像フォーマット変換 — 無料・プライベート',
      metaTitle: '画像変換 | HEIC, WebP, AVIF→JPG, PNG | BestOnline.Tools',
      metaDesc: 'HEIC、WebP、AVIFをJPG、PNG、WebPに変換。100%ブラウザ内処理。',
    },
  },
  pdf_password: {
    fr: {
      h1: 'Protéger PDF par mot de passe — Gratuit et privé',
      metaTitle: 'Protéger PDF | Chiffrement gratuit, sans téléchargement | BestOnline.Tools',
      metaDesc: 'Protégez vos PDF avec un mot de passe. Chiffrement local dans votre navigateur.',
    },
    es: {
      h1: 'Proteger PDF con contraseña — Gratuito y privado',
      metaTitle: 'Proteger PDF | Cifrado gratuito, sin subir archivos | BestOnline.Tools',
      metaDesc: 'Proteja sus PDF con contraseña. Cifrado local en su navegador.',
    },
    it: {
      h1: 'Proteggere PDF con password — Gratuito e privato',
      metaTitle: 'Proteggere PDF | Crittografia gratuita, senza upload | BestOnline.Tools',
      metaDesc: 'Proteggete i PDF con una password. Crittografia locale nel browser.',
    },
    nl: {
      h1: 'PDF beveiligen met wachtwoord — Gratis en privé',
      metaTitle: 'PDF beveiligen | Gratis encryptie, geen upload | BestOnline.Tools',
      metaDesc: 'Beveilig uw PDF met een wachtwoord. Lokale encryptie in uw browser.',
    },
    pt: {
      h1: 'Proteger PDF com senha — Gratuito e privado',
      metaTitle: 'Proteger PDF | Criptografia gratuita, sem upload | BestOnline.Tools',
      metaDesc: 'Proteja seus PDFs com senha. Criptografia local no navegador.',
    },
    pl: {
      h1: 'Zabezpiecz PDF hasłem — Darmowe i prywatne',
      metaTitle: 'Zabezpiecz PDF | Darmowe szyfrowanie, bez przesyłania | BestOnline.Tools',
      metaDesc: 'Zabezpiecz pliki PDF hasłem. Szyfrowanie lokalne w przeglądarce.',
    },
    sv: {
      h1: 'Lösenordsskydda PDF — Gratis och privat',
      metaTitle: 'Skydda PDF | Gratis kryptering, ingen uppladdning | BestOnline.Tools',
      metaDesc: 'Skydda dina PDF-filer med lösenord. Lokal kryptering i din webbläsare.',
    },
    ja: {
      h1: 'PDFパスワード保護 — 無料・プライベート',
      metaTitle: 'PDF保護 | 無料暗号化、アップロード不要 | BestOnline.Tools',
      metaDesc: 'PDFファイルをパスワードで保護。ブラウザ内でローカル暗号化。',
    },
  },
};
