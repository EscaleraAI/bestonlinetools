'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getActiveTools } from '@/lib/tools/registry';
import ToolIcon from '@/components/ui/ToolIcon';
import styles from './Header.module.css';

const NAV_GROUPS = [
  { label: 'Image Tools', category: 'image' as const },
  { label: 'PDF Tools', category: 'pdf' as const },
  { label: 'Audio Tools', category: 'audio' as const },
  { label: 'Text & Dev Tools', category: 'data' as const },
] as const;

// Only show locales that have actual pages built.
// Full list: en, de, fr, es, it, nl, pt, pl, sv, ja
// Uncomment locales as their pages are created in pageResolver.ts
const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  // { code: 'fr', label: 'Français', flag: '🇫🇷' },
  // { code: 'es', label: 'Español', flag: '🇪🇸' },
  // { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  // { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  // { code: 'pt', label: 'Português', flag: '🇵🇹' },
  // { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  // { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  // { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export default function Header() {
  const pathname = usePathname();
  const activeTools = getActiveTools();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setOpenDropdown(null);
    setLangOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  function handleMouseEnter(group: string) {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setOpenDropdown(group);
    setLangOpen(false);
  }

  function handleMouseLeave() {
    dropdownTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  function handleLangEnter() {
    if (langTimer.current) clearTimeout(langTimer.current);
    setLangOpen(true);
    setOpenDropdown(null);
  }

  function handleLangLeave() {
    langTimer.current = setTimeout(() => setLangOpen(false), 150);
  }

  // Determine current locale from path
  const currentLocale = LANGUAGES.find(l =>
    l.code !== 'en' && pathname.startsWith(`/${l.code}/`)
  )?.code ?? 'en';
  const currentLang = LANGUAGES.find(l => l.code === currentLocale)!;

  // Compute locale-equivalent path for language switching
  function getLocalizedHref(targetLocale: string): string {
    // Strip current locale prefix to get the base path
    let basePath = pathname;
    if (currentLocale !== 'en') {
      basePath = pathname.replace(`/${currentLocale}`, '') || '/';
    }
    // For homepage
    if (basePath === '/' || basePath === '') {
      return targetLocale === 'en' ? '/' : `/${targetLocale}/`;
    }
    // For other pages, prepend target locale
    if (targetLocale === 'en') {
      return basePath;
    }
    return `/${targetLocale}${basePath}`;
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="BestOnline.Tools" width={28} height={28} className={styles.logoImg} />
          <span className={styles.logoText}>BestOnline.Tools</span>
        </Link>

        {/* Desktop nav — grouped dropdowns */}
        <nav className={styles.nav}>
          {NAV_GROUPS.map((group) => {
            const groupTools = activeTools.filter(t => t.category === group.category);
            const isOpen = openDropdown === group.category;

            return (
              <div
                key={group.category}
                className={styles.navGroup}
                onMouseEnter={() => handleMouseEnter(group.category)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`${styles.navTrigger} ${isOpen ? styles.navTriggerOpen : ''}`}
                  onClick={() => setOpenDropdown(isOpen ? null : group.category)}
                  type="button"
                >
                  {group.label}
                  <ToolIcon name="chevron-down" size={14} className={styles.chevron} />
                </button>

                {isOpen && (
                  <div className={styles.dropdown}>
                    {groupTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={tool.href}
                        className={`${styles.dropdownItem} ${pathname === tool.href ? styles.active : ''}`}
                      >
                        <span className={styles.dropdownIcon}>
                          <ToolIcon name={tool.icon} size={18} />
                        </span>
                        <div className={styles.dropdownText}>
                          <span className={styles.dropdownName}>{tool.name}</span>
                          <span className={styles.dropdownTagline}>{tool.tagline}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className={styles.actions}>
          {/* Language selector */}
          <div
            className={styles.langWrap}
            onMouseEnter={handleLangEnter}
            onMouseLeave={handleLangLeave}
          >
            <button
              className={styles.langTrigger}
              onClick={() => setLangOpen(!langOpen)}
              type="button"
            >
              <ToolIcon name="globe" size={16} />
              <span>{currentLang.flag}</span>
              <ToolIcon name="chevron-down" size={12} className={styles.chevron} />
            </button>

            {langOpen && (
              <div className={styles.langDropdown}>
                {LANGUAGES.map((lang) => (
                  <Link
                    key={lang.code}
                    href={getLocalizedHref(lang.code)}
                    className={`${styles.langItem} ${lang.code === currentLocale ? styles.langActive : ''}`}
                  >
                    <span className={styles.langFlag}>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={activeTools[0]?.href ?? '/'} className="btn btn-primary">
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className={styles.mobileMenu}>
          {NAV_GROUPS.map((group) => {
            const groupTools = activeTools.filter(t => t.category === group.category);
            return (
              <div key={group.category} className={styles.mobileGroup}>
                <span className={styles.mobileGroupLabel}>{group.label}</span>
                {groupTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.href}
                    className={`${styles.mobileLink} ${
                      pathname === tool.href ? styles.active : ''
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <ToolIcon name={tool.icon} size={16} className={styles.navIcon} />
                    {tool.name}
                  </Link>
                ))}
              </div>
            );
          })}
          <Link
            href={activeTools[0]?.href ?? '/'}
            className={styles.mobileCta}
            onClick={() => setMenuOpen(false)}
          >
            Get Started →
          </Link>
        </nav>
      )}
    </header>
  );
}
