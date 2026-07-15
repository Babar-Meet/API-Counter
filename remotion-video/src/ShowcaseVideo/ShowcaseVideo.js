import { Composition } from 'remotion';
import { MainVideo } from './MainVideo.js';

export const ShowcaseVideo = () => {
  return (
    <>
      <Composition
        id="ShowcaseVideo"
        component={MainVideo}
        durationInFrames={1560}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
