import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import Logo from '@site/static/img/tinybird-isotype-heart.svg';
function Footer() {
  const {footer} = useThemeConfig();
  if (!footer) {
    return null;
  }
  const {copyright, links, logo, style} = footer;
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <div className={styles.brand}>
          <Logo className={styles.logo}/>
          <span>Created by</span>
          &nbsp;
          <a className={styles.brandLink} href='https://wwww.tinybird.co' target="_blank">Tinybird</a>
        </div>
        <div className={styles.copyright}>
          {copyright}
        </div>
        <div className={styles.links}>
          <ul className={styles.list}>
            {links.map((link, i) => (
              <li key={i} className={styles.item}>
                <a className={styles.link} href={link.href} target="_blank">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
export default React.memo(Footer);
