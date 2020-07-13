import React from 'react';
import classnames from 'classnames';

const Icon = {
  ERROR: '!',
  CHECKMARK: '✔',
  CARET: '❯'
};

const PromptIcon = props => (
  <div className={classnames('icon', props)}>
    <span>{Icon[props.icon || 'CARET']} </span>
    <style jsx>
      {`
        .icon {
          color: inherit;
          flex: 0 0 auto;
          user-select: none;
          display: flex;
          justify-items: center;
          align-items: center;
        }
        span {
          line-height: 1;
          white-space: pre;
        }
        .icon.success {
          color: lawngreen;
        }
        .error {
          color: indianred;
        }
      `}
    </style>
  </div>
);

export default PromptIcon;
