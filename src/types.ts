export interface Tag {
  bg: string;
  tx: string;
  bd: string;
  lb: string;
}

export interface Message {
  r: 'u' | 'a';
  text: string;
  tags?: Tag[];
  tip?: string;
}

export interface Step {
  title: string;
  sub: string;
  insight: string;
  msgs: Message[];
}
