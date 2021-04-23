import React, { FunctionComponent } from 'react';

import styles from '../index.module.scss';

type SingleInstructionsProps = {
  title: string;
  text: string;
  noCommentText: string;
};

const SingleComment: FunctionComponent<SingleInstructionsProps> = ({
  title,
  text,
  noCommentText,
}: SingleInstructionsProps) => (
  <div className={styles.textbox}>
    <h5>{title}</h5>
    <div>{text === '' ? noCommentText : text}</div>
  </div>
);

export default SingleComment;
