type T3ContentElement<Type extends string, Content> = {
  id: number;
  type: Type;
  content: Content;
};

export type T3MenuSubPages = T3ContentElement<
  "menu_subpages",
  { menu: { title: string; link: string }[] }
>;

export type T3MenuPages = T3ContentElement<
  "menu_pages",
  { menu: { title: string; link: string }[] }
>;

export type T3Text = T3ContentElement<
  "text",
  { bodytext: string; header: string }
>;
export type T3TextPic = T3ContentElement<
  "textpic",
  { bodytext: string; enlargeImageOnClick: boolean }
>;

export type T3Html = T3ContentElement<
  "html",
  { bodytext: string; header: string }
>;

export type T3BlogLatestPosts = T3ContentElement<
  "blog_latestposts",
  { data: { list: [] } }
>;

export type T3ContentElements =
  | T3Text
  | T3MenuSubPages
  | T3MenuPages
  | T3BlogLatestPosts
  | T3TextPic
  | T3Html;

export type T3Page = {
  id: number;
  meta: {
    title: string;
    description: string;
  };
  content: {
    colPos0: T3ContentElements[];
  };
};
