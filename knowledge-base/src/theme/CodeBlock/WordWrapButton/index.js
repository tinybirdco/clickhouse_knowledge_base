import React from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';
export default function WordWrapButton({className, onClick, isEnabled}) {
  const title = translate({
    id: 'theme.CodeBlock.wordWrapToggle',
    message: 'Toggle word wrap',
    description:
      'The title attribute for toggle word wrapping button of code block lines',
  });
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'clean-btn',
        className,
        isEnabled && styles.wordWrapButtonEnabled,
      )}
      aria-label={title}
      title={title}>
      <svg
        className={styles.wordWrapButtonIcon}
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 7h18a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2Zm6 8H3a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Zm9.5-5H3a1 1 0 0 0 0 2h15.5a1.5 1.5 0 1 1 0 3h-3.09l.3-.29a1.004 1.004 0 1 0-1.42-1.42l-2 2a1 1 0 0 0-.21.33 1 1 0 0 0 0 .76 1 1 0 0 0 .21.33l2 2a1.002 1.002 0 0 0 1.639-.325 1 1 0 0 0-.219-1.095l-.3-.29h3.09a3.5 3.5 0 1 0 0-7Z"
        />
      </svg>
    </button>
  );
}
