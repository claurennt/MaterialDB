type Links = {
  _id: string;
  title: string;
  url: string;
  tags: string;
  category: string;
}[];

type HomeProps = {
  currentTopics?: {}[];
};
type AppProps = {
  /** array of objects! (common) */
  categories: {
    type: string;
    color: string;
  }[];
  inputs: {
    name: string;
    placeholder: string;
  }[];
  /** an object with any number of properties (PREFERRED) */
  newData: {
    name: string;
    description: string;
  };
  individualTopic: {
    _id: string;
    title: string;
    description: string;
    links: Links;
    placeholder: string;
  };

  /** function type syntax that takes an event (VERY COMMON) */
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type { AppProps, HomeProps };
