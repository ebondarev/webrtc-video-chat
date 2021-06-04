import { Input } from "antd";
import React from "react";
import s from './MessangerTextarea.module.css';

export const MessangerTextarea: React.FC = () => {

  function handleKeyDown(event: React.KeyboardEvent) {
    const isAllowSend = event.ctrlKey && (event.key.toLocaleLowerCase() === 'enter');
    if (isAllowSend) {
      const textarea = event.target as HTMLTextAreaElement;
      const messageText = textarea.value.trim();
      textarea.value = '';
      // TODO: send messageText
    }
  }

  return (
    <div className={ s['textarea'] }>
      <Input.TextArea
        className={ s['textarea__element'] }
        rows={ 3 }
        onKeyDown={ handleKeyDown }
      />
    </div>
  );
}
