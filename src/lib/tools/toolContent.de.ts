import type { ToolContent } from './toolContent';

export const toolContentDe: Record<string, ToolContent> = {
  svg_vectorizer: {
    howItWorks: [
      'Unser Vektorisierer verwendet fortschrittliche Kantenerkennung und Pfadverfolgungsalgorithmen, um Rasterbilder (PNG, JPG, WebP, BMP) in saubere, skalierbare SVG-Vektordateien umzuwandeln. Das Tool analysiert Pixelgrenzen, erkennt Formen und Kurven und erzeugt optimierte SVG-Pfade — alles lokal über WebAssembly.',
      'Wählen Sie aus integrierten Voreinstellungen für Logos, Icons, Skizzen oder Fotos. Passen Sie Parameter wie Fleckenfilterung, Eckenschwellenwerte und Pfadpräzision an. Die Echtzeit-Vorschau ermöglicht einen direkten Vergleich von Original und vektorisierter Version.',
    ],
    features: [
      'Mehrere Voreinstellungen: Logo, Icon, Skizze, Foto — jeweils optimiert',
      'Einstellbare Pfadvereinfachung, Eckenerkennung und Fleckenfilterung',
      'Farb- und Schwarz-Weiß-Vektorisierungsmodi',
      'Export als SVG, PDF, EPS oder DXF für jeden Workflow',
      'Echtzeit-Vergleichsregler zur Vorschau vor dem Download',
      'SVGO-Optimierung reduziert automatisch die SVG-Dateigröße',
    ],
    faqs: [
      { q: 'Welche Bildformate kann ich in SVG konvertieren?', a: 'Sie können PNG, JPG/JPEG, WebP und BMP konvertieren. Für beste Ergebnisse bei Logos und Icons verwenden Sie ein kontrastreiches PNG mit transparentem oder einfarbigem Hintergrund.' },
      { q: 'Wie funktioniert der Vektorisierungsprozess?', a: 'Das Tool verfolgt Pixelgrenzen, erkennt Kanten und Kurven und erzeugt dann glatte SVG-Pfade mittels Spline- oder Polygonanpassung. Das Ergebnis ist eine skalierbare Vektordatei, die in jeder Größe scharf bleibt.' },
      { q: 'Kann ich Logos und Icons vektorisieren?', a: 'Ja — verwenden Sie die integrierte Logo- oder Icon-Voreinstellung für optimale Ergebnisse. Diese sind auf saubere Kanten, minimales Rauschen und hohe Pfadgenauigkeit abgestimmt.' },
      { q: 'Was ist die maximale Dateigröße oder Auflösung?', a: 'Es gibt kein festes Limit. Wir empfehlen Bilder bis 4000×4000 Pixel für die beste Balance aus Qualität und Verarbeitungsgeschwindigkeit.' },
      { q: 'Ist die SVG-Ausgabe in Design-Tools bearbeitbar?', a: 'Ja. Das erzeugte SVG enthält Standard-Pfadelemente und kann in jedem SVG-Editor geöffnet werden, einschließlich Adobe Illustrator, Figma, Inkscape und Affinity Designer.' },
      { q: 'Welche Exportformate sind verfügbar?', a: 'Sie können Ihr vektorisiertes Ergebnis als SVG (Standard), PDF, EPS oder DXF herunterladen — für Workflows von Webdesign bis Laserschnitt und CAD.' },
    ],
  },
  remove_bg: {
    howItWorks: [
      'Dieses Tool verwendet ein hochmodernes KI-Segmentierungsmodell, das direkt in Ihrem Browser mit WebGPU-Beschleunigung läuft. Das Modell identifiziert das Vordergrundobjekt und erstellt eine präzise Alphamaske zur Hintergrundentfernung — keine Cloud-Verarbeitung erforderlich.',
      'Legen Sie einfach Ihr Bild ab und die KI erledigt den Rest. Das Modell wird einmal geladen (~30MB) und bleibt in Ihrem Browser zwischengespeichert für sofortige Verarbeitung bei weiteren Verwendungen. Ergebnisse sind typischerweise in unter 3 Sekunden fertig.',
    ],
    features: [
      'KI-gestützte Kantenerkennung für präzise Ausschnitte bei Haaren, Fell und komplexen Kanten',
      'WebGPU-Beschleunigung für nahezu sofortige Verarbeitung in modernen Browsern',
      'Ein-Klick-Download als transparentes PNG',
      'Verarbeitet Porträts, Produktfotos, Logos und komplexe Szenen',
      'Modell wird lokal zwischengespeichert — einmal laden, danach sofort verarbeiten',
      'Keine Dateigrößenbeschränkung für die meisten Bilder — empfohlen bis 25MP',
    ],
    faqs: [
      { q: 'Wie genau ist die Hintergrundentfernung?', a: 'Das KI-Modell verarbeitet komplexe Kanten einschließlich Haare, Fell und halbtransparente Objekte mit hoher Präzision. Die Ergebnisse sind vergleichbar mit professionellen Tools wie Adobe Photoshop.' },
      { q: 'Funktioniert es mit Produktfotografie?', a: 'Ja — das Modell ist auf verschiedene Bildtypen trainiert, darunter Produktfotos, Porträts, Tiere und Objekte. Es eignet sich hervorragend für saubere Freisteller im E-Commerce.' },
      { q: 'In welchem Format wird ausgegeben?', a: 'Das Ergebnis wird als transparentes PNG mit vollständig entferntem Hintergrund heruntergeladen.' },
      { q: 'Werden meine Bilder auf einen Server hochgeladen?', a: 'Nein. Das KI-Modell läuft vollständig in Ihrem Browser mit WebGPU. Ihre Bilder werden niemals an einen Server gesendet — vollständige Privatsphäre ist garantiert.' },
    ],
  },
  pdf_merge: {
    howItWorks: [
      'Ziehen Sie mehrere PDF-Dateien per Drag & Drop, ordnen Sie sie visuell an und führen Sie sie zu einem einzigen Dokument zusammen — alles lokal in Ihrem Browser mit der pdf-lib-Bibliothek verarbeitet. Ihre PDFs berühren niemals einen Server.',
      'Das Tool liest die interne Struktur jeder PDF, bewahrt alle Seiten, Lesezeichen und Formatierungen und kombiniert sie zu einem durchgehenden Dokument. Sie können die Reihenfolge durch Ziehen der Dateien vor dem Zusammenführen ändern.',
    ],
    features: [
      'Unbegrenzt viele PDF-Dateien zu einem Dokument zusammenführen',
      'Drag-and-Drop-Neuanordnung vor dem Zusammenführen',
      'Bewahrt Original-Formatierung, Schriften und eingebettete Bilder',
      'Keine Dateigrößenbeschränkung — verarbeitet auch große Dokumente',
      'Sofortiger Download der zusammengeführten PDF',
      'Funktioniert nach dem Laden der Seite vollständig offline',
    ],
    faqs: [
      { q: 'Wie viele PDFs kann ich auf einmal zusammenführen?', a: 'Es gibt kein Limit — Sie können beliebig viele PDF-Dateien zu einem Dokument zusammenführen.' },
      { q: 'Behält die zusammengeführte PDF die originale Formatierung?', a: 'Ja. Das Tool bewahrt alle Seiten, Schriften, Bilder, Anmerkungen und Formatierungen aus jeder Quell-PDF exakt bei.' },
      { q: 'Werden meine PDFs auf einen Server hochgeladen?', a: 'Nein. Das gesamte Zusammenführen geschieht lokal in Ihrem Browser mit der pdf-lib-Bibliothek. Ihre Dateien verlassen niemals Ihr Gerät.' },
    ],
  },
  pdf_split: {
    howItWorks: [
      'Laden Sie eine PDF hoch und wählen Sie die Aufteilungsmethode: bestimmte Seiten extrahieren, alle N Seiten aufteilen oder in gleiche Teile aufteilen. Das Tool analysiert Ihre PDF lokal mit pdf-lib und erstellt separate Ausgabedateien ohne Server-Upload.',
      'Verwenden Sie die Seitenbereich-Syntax (z.B. „1, 3-5, 8") für präzise Seitenextraktion, oder lassen Sie das Tool Ihr Dokument automatisch in Abschnitte unterteilen.',
    ],
    features: [
      'Drei Aufteilungsmodi: Seiten extrahieren, alle N Seiten, gleiche Teile',
      'Seitenbereich-Syntax für präzise Steuerung (z.B. „1, 3-5, 8-12")',
      'Einzelne Dateien oder alle auf einmal herunterladen',
      'Bewahrt Seitenformatierung und eingebettete Inhalte',
      'Verarbeitet verschlüsselte PDFs (Nur-Lesen-Schutz)',
      'Sofortige Verarbeitung — kein Warten auf Server-Uploads',
    ],
    faqs: [
      { q: 'Welche Aufteilungsmodi gibt es?', a: 'Drei Modi: Bestimmte Seiten extrahieren (z.B. Seiten 1, 3-5), alle N Seiten aufteilen (z.B. alle 2 Seiten) oder in gleiche Teile aufteilen (z.B. 3 gleiche Abschnitte).' },
      { q: 'Kann ich bestimmte Seiten aus einer PDF extrahieren?', a: 'Ja — verwenden Sie die Seitenbereich-Syntax wie „1, 3-5, 8", um genau die benötigten Seiten in eine neue PDF zu extrahieren.' },
      { q: 'Bewahrt das Aufteilen die Original-Qualität?', a: 'Ja. Jede Ausgabedatei behält die exakte Formatierung, Schriften, Bilder und das Layout der Originalseiten bei.' },
    ],
  },
  image_compressor: {
    howItWorks: [
      'Dieser Komprimierer nutzt die native Canvas-API Ihres Browsers und intelligente Qualitätsreduktionsalgorithmen, um die Bilddateigröße bei Erhalt der visuellen Qualität zu minimieren. Legen Sie Ihre Bilder ab, passen Sie den Qualitätsregler an und sehen Sie das komprimierte Ergebnis im Vergleich.',
      'Das Tool kodiert Bilder mit der gewählten Qualitätsstufe um, entfernt unnötige Metadaten (EXIF, ICC-Profile) und optimiert die Kodierung. Sie sehen die exakte Größenersparnis und den visuellen Unterschied vor dem Download.',
    ],
    features: [
      'Einstellbarer Qualitätsregler mit Echtzeit-Größenvorschau',
      'Vergleich: Original vs. komprimiert nebeneinander',
      'Stapelverarbeitung — mehrere Bilder auf einmal komprimieren',
      'Unterstützt PNG, JPG, WebP Eingabeformate',
      'Zeigt exakten Prozentsatz der Dateigrößenreduktion',
      'Bewahrt Bildabmessungen und Seitenverhältnis',
    ],
    faqs: [
      { q: 'Wie stark kann ich die Dateigröße reduzieren?', a: 'Typische Reduktionen betragen 50-80% je nach Bild und Qualitätseinstellung. Das Tool zeigt Ihnen die exakte Ersparnis vor dem Download.' },
      { q: 'Reduziert die Komprimierung die Bildqualität?', a: 'Der Qualitätsregler ermöglicht eine Balance zwischen Dateigröße und visueller Qualität. Bei moderaten Einstellungen (70-80%) ist der Unterschied für das menschliche Auge nicht wahrnehmbar.' },
    ],
  },
  coloring_page: {
    howItWorks: [
      'Laden Sie ein beliebiges Foto hoch und das Tool wendet fortschrittliche Kantenerkennung und Kontrastanalyse an, um es in eine saubere, druckbare Ausmalseite umzuwandeln. Der Algorithmus extrahiert Umrisse und entfernt Fotodetails für klare Strichzeichnungen.',
      'Passen Sie Parameter wie Linienstärke, Detailgrad und Kontrast an. Das Ergebnis ist ein kontrastreiches Schwarz-Weiß-Bild, optimiert für den Druck auf Standardpapiergrößen.',
    ],
    features: [
      'Konvertiert jedes Foto in druckbare Strichzeichnungen',
      'Einstellbare Kantenerkennungsempfindlichkeit und Linienstärke',
      'Kontrastreiche Ausgabe, optimiert für den Druck',
      'Funktioniert mit Porträts, Landschaften, Tieren und Objekten',
      'Download als PNG, sofort druckbereit',
      'Perfekt für Lehrer, Eltern und Kreativprojekte',
    ],
    faqs: [
      { q: 'Welche Fotos funktionieren am besten?', a: 'Fotos mit klaren Motiven und gutem Kontrast — Porträts, Tiere, Landschaften und Objekte. Bei unruhigen oder kontrastarmen Bildern muss ggf. der Detailgrad angepasst werden.' },
      { q: 'Kann ich die Linienstärke anpassen?', a: 'Ja — das Tool bietet Regler für Kantenempfindlichkeit, Linienstärke und Kontrast.' },
    ],
  },
  audio_converter: {
    howItWorks: [
      'Dieses Tool verwendet FFmpeg, kompiliert zu WebAssembly, für professionelle Audiokonvertierung direkt in Ihrem Browser. Die FFmpeg-Engine wird einmal geladen (~30MB) und bleibt für sofortige Konvertierungen zwischengespeichert.',
      'Wählen Sie Ihr Zielformat (MP3, WAV, OGG, FLAC, AAC, M4A), passen Sie optional Bitrate und Abtastrate an und konvertieren Sie. Das Tool übernimmt Codec-Transkodierung und formatspezifische Optimierungen automatisch.',
    ],
    features: [
      'Konvertierung zwischen MP3, WAV, OGG, FLAC, AAC und M4A',
      'Einstellbare Bitrate (64kbps bis 320kbps) und Abtastrate',
      'FFmpeg-basiert — professionelle Codec-Unterstützung',
      'Verarbeitet Dateien bis 100MB',
      'Audio-Trimming mit Start-/Endzeit-Steuerung',
      'Bewahrt ID3-Tags und Metadaten wo unterstützt',
    ],
    faqs: [
      { q: 'Zwischen welchen Audioformaten kann ich konvertieren?', a: 'Unterstützte Formate: MP3, WAV, OGG, FLAC, AAC und M4A. Sie können zwischen beliebigen Kombinationen konvertieren.' },
      { q: 'Werden meine Audiodateien auf einen Server hochgeladen?', a: 'Nein. Alle Konvertierung geschieht lokal in Ihrem Browser mit WebAssembly. Ihre Audiodateien verlassen niemals Ihr Gerät.' },
    ],
  },
  speech_to_text: {
    howItWorks: [
      'Angetrieben von OpenAIs Whisper-Modell, das lokal über WebAssembly läuft, transkribiert dieses Tool gesprochenes Audio mit hoher Genauigkeit in Text. Das KI-Modell wird einmal geladen und verarbeitet Ihr Audio vollständig auf Ihrem Gerät.',
      'Laden Sie eine Audio- oder Videodatei hoch, wählen Sie die Sprache (oder lassen Sie sie automatisch erkennen) und erhalten Sie ein Transkript mit Zeitstempeln. Export als Klartext, SRT-Untertitel oder VTT-Format.',
    ],
    features: [
      'OpenAI Whisper KI — modernste Spracherkennungsgenauigkeit',
      'Unterstützt 99+ Sprachen mit automatischer Spracherkennung',
      'Zeitgestempelte Ausgabe für Untertitelgenerierung',
      'Export als Klartext, SRT oder VTT-Format',
      'Läuft vollständig lokal — Ihr Audio bleibt privat',
      'Verarbeitet MP3, WAV, OGG, FLAC, M4A und Videodateien',
    ],
    faqs: [
      { q: 'Wie genau ist die Transkription?', a: 'Das Tool verwendet OpenAIs Whisper-Modell mit nahezu menschlicher Genauigkeit bei klarem Audio. Beste Ergebnisse bei deutlicher Sprache und wenig Hintergrundgeräuschen.' },
      { q: 'Welche Sprachen werden unterstützt?', a: 'Whisper unterstützt 99+ Sprachen einschließlich Deutsch, Englisch, Französisch, Spanisch, Japanisch, Chinesisch und viele mehr.' },
      { q: 'Sind meine Audiodaten privat?', a: 'Vollständig. Das Whisper KI-Modell läuft komplett in Ihrem Browser über WebAssembly. Keine Audiodaten werden jemals an einen Server gesendet.' },
    ],
  },
  image_converter: {
    howItWorks: [
      'Konvertieren Sie Bilder zwischen allen gängigen Formaten mit den nativen Canvas- und Kodierungs-APIs Ihres Browsers. Das Tool unterstützt HEIC, WebP, AVIF, PNG, JPG und BMP — einschließlich Apples HEIC-Format.',
      'Legen Sie ein oder mehrere Bilder ab, wählen Sie Zielformat und Qualitätseinstellungen, und konvertieren Sie alle Dateien auf einmal. Jedes Bild wird clientseitig ohne Server-Upload neu kodiert.',
    ],
    features: [
      'Volle HEIC/HEIF-Unterstützung — iPhone-Fotos sofort in JPG konvertieren',
      'Stapelkonvertierung — Dutzende Bilder auf einmal verarbeiten',
      'Unterstützung für HEIC, WebP, AVIF, PNG, JPG und BMP',
      'Einstellbare Ausgabequalität für verlustbehaftete Formate',
      'Bewahrt Bildabmessungen und Farbtreue',
      'Einzelne Dateien oder alle konvertierten Bilder auf einmal herunterladen',
    ],
    faqs: [
      { q: 'Kann ich HEIC-Fotos von meinem iPhone konvertieren?', a: 'Ja — dieses Tool unterstützt Apples HEIC/HEIF-Format. Legen Sie Ihre iPhone-Fotos ab und konvertieren Sie sie sofort in JPG, PNG oder WebP.' },
      { q: 'Werden meine Bilder irgendwohin hochgeladen?', a: 'Nein. Alle Konvertierung nutzt die native Canvas-API Ihres Browsers. Bilder werden lokal verarbeitet und verlassen niemals Ihr Gerät.' },
    ],
  },
  pdf_password: {
    howItWorks: [
      'Fügen Sie Passwortschutz zu jeder PDF mit AES-256-Verschlüsselung hinzu — dem Industriestandard, der von Banken und Behörden verwendet wird. Die Verschlüsselung läuft vollständig in Ihrem Browser über WebAssembly.',
      'Wählen Sie ein starkes Passwort, bestätigen Sie es und laden Sie die verschlüsselte PDF herunter. Empfänger benötigen das Passwort zum Öffnen. Die originale Formatierung wird exakt beibehalten.',
    ],
    features: [
      'AES-256-Verschlüsselung — Sicherheitsstandard auf Militärniveau',
      'Passwort-zum-Öffnen-Schutz verhindert unbefugten Zugriff',
      'Bewahrt alle Formatierungen, Schriften und eingebettete Bilder',
      'Verarbeitet PDFs bis 200MB',
      'Zero-Knowledge — Ihr Passwort verlässt niemals Ihr Gerät',
      'Kompatibel mit allen PDF-Readern (Adobe, Chrome, Preview)',
    ],
    faqs: [
      { q: 'Welcher Verschlüsselungsstandard wird verwendet?', a: 'Das Tool verwendet AES-256-Verschlüsselung, denselben Standard, der von Banken und Behörden eingesetzt wird.' },
      { q: 'Wird mein Passwort gespeichert oder übertragen?', a: 'Nein. Ihr Passwort wird nur zur Verschlüsselung in Ihrem Browser verwendet und wird niemals gespeichert, übertragen oder protokolliert.' },
    ],
  },
  images_to_pdf: {
    howItWorks: [
      'Legen Sie Ihre Bilder ab, ordnen Sie sie per Drag & Drop und wählen Sie eine Seitengröße — An Bild anpassen, A4 oder US Letter. Jedes Bild wird eine Seite im PDF, zentriert und an das gewählte Layout angepasst.',
      'Die Konvertierung läuft vollständig in Ihrem Browser mit pdf-lib.js. Ihre Bilder werden direkt in die PDF-Struktur eingebettet, ohne Neukomprimierung.',
    ],
    features: [
      'Drag-and-Drop-Neuanordnung der Seitenreihenfolge',
      'Mehrere Seitengrößen: An Bild anpassen, A4, Letter',
      'Unterstützt JPG, PNG, WebP, BMP und GIF',
      'Bewahrt originale Bildqualität — keine Neukomprimierung',
      'Stapelverarbeitung: Dutzende Bilder auf einmal konvertieren',
      'Sofortiger Download — keine Wasserzeichen, keine Limits',
    ],
    faqs: [
      { q: 'Welche Bildformate kann ich in PDF konvertieren?', a: 'JPG/JPEG, PNG, WebP, BMP und GIF. Jedes Bild wird eine Seite im PDF.' },
      { q: 'Werden meine Bilder auf einen Server hochgeladen?', a: 'Nein. Alles wird lokal in Ihrem Browser verarbeitet. Ihre Bilder verlassen niemals Ihr Gerät.' },
    ],
  },
  pdf_watermark: {
    howItWorks: [
      'Laden Sie eine PDF hoch, geben Sie Ihren Wasserzeichentext ein und konfigurieren Sie Transparenz, Größe, Drehung und Position. Das Tool zeichnet das Wasserzeichen auf jede Seite.',
      'Die Verarbeitung ist 100% lokal — Ihre PDF wird niemals auf einen Server hochgeladen. Das Wasserzeichen wird direkt in die PDF-Struktur eingebettet.',
    ],
    features: [
      'Benutzerdefinierte Text-Wasserzeichen — VERTRAULICH, ENTWURF oder beliebiger Text',
      'Einstellbare Transparenz von 5% bis 100%',
      'Schriftgrößensteuerung von 12pt bis 120pt',
      'Drehwinkel von -90° bis 90°',
      'Positionsvoreinstellungen: Mitte, Ecken',
      'Automatische Anwendung auf alle Seiten',
    ],
    faqs: [
      { q: 'Erscheint das Wasserzeichen beim Drucken?', a: 'Ja — das Wasserzeichen ist in der PDF-Struktur eingebettet und erscheint sowohl auf dem Bildschirm als auch beim Druck.' },
      { q: 'Sind meine Dateien privat?', a: 'Ja. Alle Verarbeitung geschieht in Ihrem Browser. Ihre PDF verlässt niemals Ihr Gerät.' },
    ],
  },
  pdf_page_numbers: {
    howItWorks: [
      'Laden Sie eine PDF hoch und konfigurieren Sie die Seitennummerierung — Position, Format, Startnummer und Schriftgröße. Das Tool fügt den Seitenzahltext auf jeder Seite hinzu.',
      'Wählen Sie aus mehreren Nummerierungsformaten: einfache Zahlen (1, 2, 3), „Seite X von Y", gestrichelt (— 1 —) oder römische Ziffern (i, ii, iii).',
    ],
    features: ['Sechs Positionsoptionen: oben/unten × links/mitte/rechts', 'Vier Zahlenformate: einfach, Seite X von Y, gestrichelt, römisch', 'Benutzerdefinierte Startnummer', 'Einstellbare Schriftgröße (6-36pt)', 'Live-Vorschau des Formats', 'Sofortige Anwendung auf alle Seiten'],
    faqs: [{ q: 'Sind meine Dateien privat?', a: 'Ja. Alles läuft lokal in Ihrem Browser — Ihre PDF verlässt niemals Ihr Gerät.' }],
  },
  image_resize: {
    howItWorks: [
      'Laden Sie ein Bild hoch und wählen Sie die Methode — exakte Pixelmaße, Prozentskalierung oder Social-Media-Voreinstellungen wie Instagram, YouTube oder Facebook.',
      'Das Tool nutzt die native Canvas-API mit hochqualitativer bikubischer Interpolation für scharfe Ergebnisse. Export als PNG, JPG oder WebP.',
    ],
    features: ['Drei Modi: Pixelmaße, Prozent, Voreinstellungen', 'Social-Media-Voreinstellungen: Instagram, Facebook, Twitter, YouTube', 'Seitenverhältnis-Sperre gegen Verzerrung', 'Ausgabeformat: PNG, JPG oder WebP', 'Qualitätsregler für JPG und WebP', 'Echtzeit-Vorschau'],
    faqs: [{ q: 'Sind meine Bilder privat?', a: 'Ja. Alle Verarbeitung geschieht lokal in Ihrem Browser.' }],
  },
  image_base64: {
    howItWorks: [
      'Im Kodierungsmodus konvertiert das Tool ein Bild sofort in eine Base64-Data-URI. Im Dekodierungsmodus wird ein Base64-String als Bild gerendert.',
      'Alles läuft im Browser — kein Server erforderlich.',
    ],
    features: ['Zwei Modi: Bild → Base64 und Base64 → Bild', 'Kopieren als vollständige Data-URI oder rohen Base64-String', 'Unterstützt alle gängigen Bildformate', 'Sofortige Kodierung', 'Dekodierte Bilder als PNG herunterladen', 'Nützlich für HTML/CSS/JSON-Einbettung'],
    faqs: [{ q: 'Was ist Base64-Kodierung?', a: 'Base64 konvertiert binäre Bilddaten in einen Textstring, der direkt in HTML, CSS oder JSON eingebettet werden kann.' }],
  },
  video_to_gif: {
    howItWorks: [
      'Laden Sie ein Video hoch, setzen Sie Start- und Endzeit, wählen Sie FPS und Breite. Das Tool verwendet FFmpeg.wasm für die Verarbeitung direkt in Ihrem Browser.',
      'Die Konvertierung nutzt einen Zwei-Pass-Palettengenerierungsalgorithmus für optimale GIF-Farbqualität.',
    ],
    features: ['Zwei-Pass-Konvertierung für überlegene GIF-Qualität', 'Video-Trimming mit Start-/Endzeit', 'Einstellbare FPS: 10, 15, 20 oder 25', 'Breitenvoreinstellungen: 320px bis 800px', 'Unterstützt MP4, WebM, MOV und AVI', 'Echtzeit-Fortschrittsanzeige'],
    faqs: [{ q: 'Welche Videoformate werden unterstützt?', a: 'MP4, WebM, MOV und AVI. Die meisten modernen Videoformate sollten funktionieren.' }],
  },
  qr_code: {
    howItWorks: [
      'Geben Sie eine URL, Text oder WLAN-Zugangsdaten ein und das Tool generiert einen QR-Code in Echtzeit. Passen Sie Farben und Größe an, dann laden Sie als PNG oder SVG herunter.',
      'QR-Codes werden vollständig in Ihrem Browser generiert. Keine Daten werden an einen Server gesendet.',
    ],
    features: ['Drei Eingabemodi: URL, Text und WLAN', 'Live-Vorschau beim Tippen', 'Benutzerdefinierte Vordergrund- und Hintergrundfarben', 'Mehrere Größenoptionen von 200px bis 800px', 'Download als PNG oder SVG', 'WLAN-QR-Codes funktionieren mit iOS und Android'],
    faqs: [{ q: 'Sind meine Eingaben privat?', a: 'Ja. Alle QR-Code-Generierung geschieht in Ihrem Browser. Nichts wird an einen Server gesendet.' }],
  },
  sign_pdf: {
    howItWorks: [
      'Laden Sie eine PDF hoch, zeichnen Sie Ihre Unterschrift auf dem Canvas, positionieren Sie sie auf einer beliebigen Seite. Die Unterschrift wird als PNG in die PDF eingebettet.',
      'Passen Sie Größe und Position mit Reglersteuerungen an, wählen Sie die Seite und laden Sie die unterschriebene PDF sofort herunter.',
    ],
    features: ['Touch-freundliches Signatur-Canvas — funktioniert auf Desktop und Mobilgeräten', 'Unterschrift auf jeder Seite platzierbar', 'Einstellbare Größe und Position (X/Y)', 'Bewahrt alle originalen PDF-Inhalte', 'Sofortiger Download — keine Wasserzeichen', '100% clientseitig — Ihre PDF verlässt niemals Ihr Gerät'],
    faqs: [{ q: 'Sind meine Dokumente privat?', a: 'Ja. Alle Verarbeitung geschieht lokal in Ihrem Browser. Ihre PDF wird nirgendwo hochgeladen.' }],
  },
  pdf_form_filler: {
    howItWorks: [
      'Laden Sie eine PDF mit ausfüllbaren Formularfeldern hoch. Das Tool erkennt automatisch alle interaktiven Felder — Textfelder, Kontrollkästchen, Dropdown-Menüs und Optionsfelder.',
      'Füllen Sie die Felder aus und laden Sie die ausgefüllte PDF herunter. Das Formular wird „abgeflacht", sodass die Werte dauerhaften Text werden.',
    ],
    features: ['Automatische Erkennung von Textfeldern, Kontrollkästchen und Dropdown-Menüs', 'Bearbeitbare Formular-UI für jedes Feld', 'Abflachung für universelle Kompatibilität', 'Bewahrt alle anderen PDF-Inhalte', 'Keine Feldbegrenzung', '100% clientseitig — Ihre Daten bleiben privat'],
    faqs: [{ q: 'Sind meine Formulareingaben privat?', a: 'Ja. Alle Verarbeitung geschieht lokal. Ihre Daten und PDF werden niemals an einen Server übertragen.' }],
  },
  pdf_to_images: {
    howItWorks: [
      'Laden Sie eine PDF hoch und das Tool rendert jede Seite mit PDF.js als hochauflösendes Bild. Wählen Sie die Renderqualität: 1× (72 DPI), 2× (144 DPI) oder 3× (216 DPI).',
      'Laden Sie einzelne Seiten oder alle auf einmal herunter.',
    ],
    features: ['Jede PDF-Seite in PNG oder JPG konvertieren', 'Drei Qualitätsstufen: 72, 144 oder 216 DPI', 'Visuelles Raster aller extrahierten Seiten', 'Einzelne Seiten oder alle herunterladen', 'Fortschrittsanzeige bei mehrseitigen PDFs', '100% clientseitig'],
    faqs: [{ q: 'Sind meine Dateien privat?', a: 'Ja. Die PDF wird vollständig in Ihrem Browser mit PDF.js gerendert. Nichts wird hochgeladen.' }],
  },
  ocr: {
    howItWorks: [
      'Laden Sie ein Bild mit Text hoch — ein Foto, Screenshot oder gescanntes Dokument. Wählen Sie die Sprache und klicken Sie auf Extrahieren. Das Tool nutzt Tesseract.js für die Texterkennung.',
      'Der extrahierte Text erscheint in einem bearbeitbaren Textfeld. Kopieren Sie ihn oder laden Sie ihn als .txt-Datei herunter.',
    ],
    features: ['Unterstützt 10 Sprachen inkl. Deutsch, Englisch, Französisch', 'Echtzeit-Fortschrittsanzeige', 'Genauigkeitswert für die Texterkennung', 'Bearbeitbare Textausgabe', 'In Zwischenablage kopieren oder als .txt herunterladen', 'Funktioniert mit Fotos, Screenshots und gescannten Dokumenten'],
    faqs: [{ q: 'Sind meine Bilder privat?', a: 'Ja. Alle Verarbeitung geschieht lokal mit Tesseract.js. Ihre Bilder und Texte verlassen niemals Ihr Gerät.' }],
  },
  word_counter: {
    howItWorks: [
      'Tippen oder fügen Sie Text ein und sehen Sie Statistiken in Echtzeit. Das Tool zählt Wörter, Zeichen, Sätze, Absätze und schätzt Lese- und Sprechzeit.',
      'Statistiken werden bei jedem Tastendruck sofort aktualisiert.',
    ],
    features: ['Live Wort-, Zeichen-, Satzzählung', 'Zeichen mit und ohne Leerzeichen', 'Absatzzähler', 'Lesezeit-Schätzung (200 WpM)', 'Sprechzeit-Schätzung (130 WpM)', 'Kopieren und Löschen-Buttons'],
    faqs: [{ q: 'Wird mein Text gespeichert?', a: 'Nein. Alles geschieht lokal in Ihrem Browser. Ihr Text verlässt niemals Ihr Gerät.' }],
  },
  case_converter: {
    howItWorks: [
      'Fügen Sie Text ein und klicken Sie auf eine Schaltfläche zur Umwandlung. Unterstützt Großbuchstaben, Kleinbuchstaben, Titelschreibung, Satzschreibung, abwechselnde und inverse Schreibung.',
      'Die Umwandlung ist sofort und funktioniert mit beliebig langem Text.',
    ],
    features: ['6 Modi: groß, klein, Titel, Satz, abwechselnd, invers', 'Ein-Klick-Umwandlung', 'In Zwischenablage kopieren', 'Live-Zeichenzählung'],
    faqs: [{ q: 'Was ist Titelschreibung?', a: 'Jedes Wort beginnt mit einem Großbuchstaben, der Rest ist klein. Beispiel: „Der Schnelle Braune Fuchs."' }],
  },
  lorem_ipsum: {
    howItWorks: [
      'Wählen Sie Absätze, Sätze oder Wörter, legen Sie die Anzahl fest und klicken Sie auf Generieren. Das Tool erzeugt Standard-Lorem-Ipsum-Platzhaltertext.',
      'Der generierte Text folgt dem klassischen Lorem-Ipsum-Korpus, den Designer seit den 1960er Jahren verwenden.',
    ],
    features: ['Drei Modi: Absätze, Sätze, Wörter', 'Konfigurierbare Anzahl', 'In Zwischenablage kopieren', 'Wort- und Zeichenzählung der Ausgabe'],
    faqs: [{ q: 'Was ist Lorem Ipsum?', a: 'Lorem Ipsum ist Standard-Platzhaltertext, der seit den 1500er Jahren in Design und Typografie verwendet wird.' }],
  },
  text_to_pdf: {
    howItWorks: [
      'Tippen oder fügen Sie Text ein, wählen Sie Schriftart und -größe und klicken Sie auf Konvertieren. Das Tool erzeugt eine PDF mit korrektem Zeilenumbruch und Seitenumbruch.',
      'Der Konverter verarbeitet lange Dokumente mit automatischem Seitenumbruch auf A4-Seiten mit Rändern.',
    ],
    features: ['Drei Schriftarten: Helvetica, Times Roman, Courier', 'Mehrere Schriftgrößen (10–18pt)', 'Automatischer Zeilenumbruch und Seitenumbruch', 'A4-Seitenformat mit Rändern', 'Sofortiger Download'],
    faqs: [{ q: 'Wird mein Text an einen Server gesendet?', a: 'Nein. Die PDF wird vollständig in Ihrem Browser mit pdf-lib.js erzeugt.' }],
  },
  json_formatter: {
    howItWorks: [
      'Fügen Sie JSON in das Eingabefeld ein, dann klicken Sie auf Formatieren für hübsche Ausgabe oder Minifizieren für Komprimierung. Ungültiges JSON zeigt eine detaillierte Fehlermeldung.',
      'Der Formatierer nutzt den nativen JSON.parse() des Browsers zur Validierung und JSON.stringify() für die Formatierung.',
    ],
    features: ['Formatierung mit 2 oder 4 Leerzeichen Einrückung', 'Minifizierung auf eine Zeile', 'JSON validieren und Fehler anzeigen', 'Formatierte Ausgabe kopieren', 'Monospace-Code-Ansicht'],
    faqs: [{ q: 'Gibt es ein Größenlimit?', a: 'Kein festes Limit. Der Formatierer verarbeitet große JSON-Payloads (mehrere MB) in Ihrem Browser.' }],
  },
  color_picker: {
    howItWorks: [
      'Klicken Sie auf den Farbkreis oder geben Sie HEX/RGB-Werte direkt ein. Das Tool konvertiert sofort zwischen HEX, RGB und HSL.',
      'Alle drei Farbformate werden in Echtzeit aktualisiert. Ein-Klick-Kopieren für CSS und Design-Tools.',
    ],
    features: ['Visueller Farbwähler', 'HEX, RGB, HSL Konvertierung', 'Direkte RGB-Kanaleingabe', 'Ein-Klick-Kopieren für jedes Format', 'Live-Vorschau'],
    faqs: [{ q: 'Kann ich dies für CSS-Farben verwenden?', a: 'Ja — alle Ausgabeformate sind gültiges CSS.' }],
  },
  url_encoder: {
    howItWorks: [
      'Wählen Sie Kodieren oder Dekodieren, fügen Sie Text oder URL ein und klicken Sie. Kodieren wendet Prozentkodierung an; Dekodieren macht sie rückgängig.',
      'Das Tool verwendet die Standard-Funktionen encodeURIComponent und decodeURIComponent.',
    ],
    features: ['Kodier- und Dekodiermodus', 'Standard encodeURIComponent/decodeURIComponent', 'Ausgabe in Zwischenablage kopieren', 'Live-Vorschau'],
    faqs: [{ q: 'Was ist URL-Kodierung?', a: 'URL-Kodierung ersetzt Sonderzeichen durch prozentkodierten Äquivalente (z.B. Leerzeichen → %20), damit sie sicher in URLs verwendet werden können.' }],
  },
  base64_text: {
    howItWorks: [
      'Wählen Sie Kodieren oder Dekodieren, geben Sie Text oder Base64-String ein und klicken Sie. Kodieren konvertiert Text zu Base64; Dekodieren macht es rückgängig.',
      'Das Tool verarbeitet den UTF-8-Kodierungsschritt intern, sodass Unicode-Text korrekt erhalten bleibt.',
    ],
    features: ['Text zu Base64 kodieren', 'Base64 zu Text dekodieren', 'Volle UTF-8 Unicode-Unterstützung', 'Ausgabe in Zwischenablage kopieren', 'Fehlerbehandlung für ungültiges Base64'],
    faqs: [{ q: 'Unterstützt es Unicode?', a: 'Ja — das Tool verarbeitet mehrbyte UTF-8-Zeichen korrekt, einschließlich Umlaute, CJK-Zeichen und Emojis.' }],
  },
  password_generator: {
    howItWorks: [
      'Klicken Sie auf Generieren für ein zufälliges Passwort. Passen Sie die Länge an (6–64 Zeichen) und wählen Sie Zeichentypen: Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen.',
      'Der Generator verwendet die Web Crypto API — denselben kryptographisch sicheren Zufallsgenerator, den Banken verwenden. Ihr Passwort wird vollständig in Ihrem Browser erstellt.',
    ],
    features: ['Kryptographisch sichere Zufallszahlen (Web Crypto API)', 'Längenregler: 6–64 Zeichen', 'Großbuchstaben, Kleinbuchstaben, Zahlen, Sonderzeichen', 'Echtzeit-Stärkeanzeige', 'Ein-Klick-Kopieren', 'Mehrere Passwörter generieren'],
    faqs: [{ q: 'Werden meine Passwörter gespeichert?', a: 'Nein. Alles läuft lokal in Ihrem Browser. Wir haben keinen Server und keine Möglichkeit, Ihre Passwörter zu sehen.' }],
  },
  pdf_rotate: {
    howItWorks: [
      'Laden Sie eine PDF hoch, wählen Sie den Drehwinkel (90°, 180° oder 270°) und ob alle oder bestimmte Seiten gedreht werden sollen.',
      'Das Tool verwendet pdf-lib für die Verarbeitung — alles ohne Dateien an einen Server zu senden.',
    ],
    features: ['Drehung um 90°, 180° oder 270° im Uhrzeigersinn', 'Alle Seiten oder bestimmte Seitenauswahl', 'Bewahrt alle PDF-Inhalte und Formatierung', 'Verarbeitet gescannte Dokumente und große Dateien', 'Sofortiger Download', '100% clientseitig'],
    faqs: [{ q: 'Kann ich einzelne Seiten drehen?', a: 'Ja — wechseln Sie zum benutzerdefinierten Modus und geben Sie Seitennummern durch Komma getrennt ein.' }],
  },
  diff_checker: {
    howItWorks: [
      'Fügen Sie den Originaltext links und die geänderte Version rechts ein. Klicken Sie auf Vergleichen für einen vereinheitlichten Diff mit farbigen Hervorhebungen.',
      'Das Tool führt einen zeilenweisen Vergleich durch und identifiziert die minimalen Änderungen.',
    ],
    features: ['Eingabefelder nebeneinander', 'Vereinheitlichte Diff-Ausgabe mit Farbkodierung', 'Grün für Hinzufügungen, Rot für Löschungen', 'Zeilenweiser Vergleich mit Zeilennummern', 'Statistiken: hinzugefügt, entfernt, unverändert', 'Verarbeitet große Texte'],
    faqs: [{ q: 'Kann ich Code-Dateien vergleichen?', a: 'Ja — es funktioniert hervorragend zum Vergleichen von Code, Konfigurationsdateien, SQL-Abfragen, JSON oder beliebigem Klartext.' }],
  },
  hash_generator: {
    howItWorks: [
      'Geben Sie Text ein und klicken Sie auf Hashes generieren. Das Tool berechnet SHA-1, SHA-256, SHA-384 und SHA-512 Hashes mit der Web Crypto API.',
      'Hashing ist eine Einwegfunktion: Sie können einen Hash aus beliebigem Text generieren, aber nicht umkehren.',
    ],
    features: ['SHA-1, SHA-256, SHA-384, SHA-512 Algorithmen', 'Native Web Crypto API', 'Ein-Klick-Kopieren für jeden Hash', 'Sofortige Berechnung', 'Verarbeitet lange Texte', 'Hexadezimale Ausgabe'],
    faqs: [{ q: 'Wird mein Text an einen Server gesendet?', a: 'Nein. Alles geschieht in Ihrem Browser mit der Web Crypto API.' }],
  },
  regex_tester: {
    howItWorks: [
      'Geben Sie ein Regex-Muster und Flags ein, tippen oder fügen Sie Ihren Teststring ein. Übereinstimmungen werden in Echtzeit aufgelistet.',
      'Das Tool nutzt JavaScripts native RegExp-Engine. Perfekt zum Debuggen von Mustern vor der Verwendung im Code.',
    ],
    features: ['Live-Abgleich beim Tippen', 'Alle JavaScript-Regex-Flags (g, i, m, s, u, y)', 'Übereinstimmungsliste mit Positionen', 'Fehlermeldungen bei ungültigen Mustern', 'Syntaxhervorhebung', 'Regex oder Übereinstimmungen kopieren'],
    faqs: [{ q: 'Welche Regex-Syntax wird unterstützt?', a: 'JavaScript/ECMAScript reguläre Ausdrücke mit Gruppen, Lookaheads, Lookbehinds, benannten Captures und Zeichenklassen.' }],
  },
  csv_json: {
    howItWorks: [
      'Wählen Sie CSV→JSON oder JSON→CSV Modus. Fügen Sie Ihre Daten ein und klicken Sie auf Konvertieren. CSV-Kopfzeilen werden zu JSON-Schlüsseln.',
      'Der Konverter verarbeitet Sonderfälle wie zitierte Felder, Kommas in Werten und Zeilenumbrüche in Anführungszeichen korrekt.',
    ],
    features: ['Bidirektional: CSV→JSON und JSON→CSV', 'Automatische Kopfzeilenerkennung', 'Korrekte CSV-Maskierung', 'Gültige JSON-Ausgabe', 'Ein-Klick-Kopieren', 'Verarbeitet große Datensätze'],
    faqs: [{ q: 'Welches CSV-Format wird erwartet?', a: 'Standard kommagetrennte Werte. Die erste Zeile wird als Spaltenkopfzeile behandelt.' }],
  },
  markdown_html: {
    howItWorks: [
      'Wählen Sie Markdown→HTML oder HTML→Markdown Modus. Fügen Sie Ihren Inhalt ein und klicken Sie auf Konvertieren. Unterstützt Überschriften, Fett, Kursiv, Links, Bilder und Listen.',
      'Der Konverter wandelt Markdown-Syntax in semantische HTML-Tags um oder umgekehrt.',
    ],
    features: ['Bidirektional: Markdown→HTML und HTML→Markdown', 'Volle Überschriftenunterstützung (H1–H6)', 'Fett, Kursiv, Inline-Code und Durchgestrichen', 'Links, Bilder und Blockzitate', 'Geordnete und ungeordnete Listen', 'Keine externen Abhängigkeiten'],
    faqs: [{ q: 'Gibt es ein Größenlimit?', a: 'Kein festes Limit. Der Konverter verarbeitet große Dokumente. Alle Verarbeitung läuft in Ihrem Browser.' }],
  },
};
