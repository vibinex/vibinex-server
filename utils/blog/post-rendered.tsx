import ImageSlider from "../../components/blog/ImageSlider";
import Media from "../../components/blog/Media";
import Quote from "../../components/blog/Quote";
import RichText from "../../components/blog/RichText";
import VideoEmbed from "../../components/blog/VideoEmbed";


export function postRenderer(section: any, index: number) {
  switch (section.__component) {
    case "shared.rich-text":
      return <RichText key={index} data={section} />;
    case "shared.slider":
      return <ImageSlider key={index} data={section} />;
    case "shared.quote": 
      return <Quote key={index} data={section} />;
    case "shared.media":
      return <Media key={index} data={section} />;
    case "shared.video-embed":
      return <VideoEmbed key={index} data={section} />;
    default:
      return null;
  }
}