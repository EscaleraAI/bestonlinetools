'use client';

import { useState, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './MarkdownHtmlTool.module.css';

// Simple markdown to HTML converter (no deps)
function md2html(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>');
  if (!html.startsWith('<')) html = '<p>' + html + '</p>';
  html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
  return html;
}

// Simple HTML to markdown converter
function html2md(html: string): string {
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function MarkdownHtmlTool() {
  const { t } = useLocale();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'md2html' | 'html2md'>('md2html');
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    setOutput(mode === 'md2html' ? md2html(input) : html2md(input));
  }, [input, mode]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  return (
    <div className={styles.container}>
      <div className={styles.modeToggle}>
        <button className={`${styles.modeBtn} ${mode === 'md2html' ? styles.modeActive : ''}`}
          onClick={() => { setMode('md2html'); setOutput(''); }}>{t('markdownHtml.mdToHtml')}</button>
        <button className={`${styles.modeBtn} ${mode === 'html2md' ? styles.modeActive : ''}`}
          onClick={() => { setMode('html2md'); setOutput(''); }}>{t('markdownHtml.htmlToMd')}</button>
      </div>
      <div className={styles.layout}>
        <div className={styles.col}>
          <span className={styles.colTitle}>{mode === 'md2html' ? t('markdownHtml.markdown') : t('markdownHtml.html')}</span>
          <textarea className={styles.area} value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'md2html' ? '# Hello World\n\nThis is **bold** and *italic*.' : '<h1>Hello World</h1>\n<p>This is <strong>bold</strong>.</p>'}
            rows={12} />
        </div>
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colTitle}>{mode === 'md2html' ? t('markdownHtml.html') : t('markdownHtml.markdown')}</span>
            {output && <button className={styles.copyBtn} onClick={handleCopy}>{copied ? t('markdownHtml.copied') : t('markdownHtml.copy')}</button>}
          </div>
          <textarea className={styles.area} value={output} readOnly rows={12} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleConvert}>{t('markdownHtml.convertButton')}</button>
    </div>
  );
}
