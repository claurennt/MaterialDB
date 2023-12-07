import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const MailActivationSuccess = () => {
  // the query string of activated is shown in the url
  const {
    query: { activated },
  } = useRouter();

  const [isMailActivated, setIsMailActivated] = useState<boolean>(
    Boolean(activated)
  );

  // if we activated our account, we want to show a success message
  useEffect(() => {
    if (activated) {
      const timerID = setTimeout(() => {
        setIsMailActivated(false);
      }, 1200);
      return () => clearTimeout(timerID);
    }
  }, []);

  //TODO: add toast notiification
  return isMailActivated && <div>Mail successfully activated!</div>;
};

export default MailActivationSuccess;
