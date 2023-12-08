import styles from 'pages/index.module.css';

const Subtitle = () => {
  const { description } = styles;
  return (
    <>
      <h2>
        MaterialDB is an app where you can collect useful links and resources
        that help you become a better <span>developer/instructor</span>.
      </h2>
      <p className={description}>
        If you wanna see a list of resources pick a topic below.
      </p>
    </>
  );
};

export default Subtitle;
