export interface Video {
  caption: string;
  video: {
    asset: {
      _id: string;
      url: string;
    };
  };
  _id: string;
  postedBy: {
    _id: string;
    userName: string;
    image: string;
    follower: { _key: string; _ref: string; _type: string }[];
    following: { _key: string; _ref: string; _type: string }[];
  };
  likes: {
    postedBy: {
      _id: string;
      userName: string;
      image: string;
    };
  }[];
  comments: {
    comment: string;
    _key: string;
    postedBy: {
      _ref: string;
    };
  }[];
  userId: string;
}

export interface IUser {
  _id: string;
  _type?: string;
  userName: string;
  image: string;
  follower?: { _key: string; _ref: string; _type: string }[];
  following?: { _key: string; _ref: string; _type: string }[];
}
