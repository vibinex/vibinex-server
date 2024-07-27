import { Principles } from "../../../utils/about";

const OurPrinciples = () => {
      return (
            <div>
                {
                    Principles.map((item) => 
                    <div key={item.title}>
                        <div><img src={item.img} alt={item.title}/></div>
                        <div>{item.title}</div>
                        <div>{item.body}</div>
                    </div>
                )
                }
            </div>
      );
};

export default OurPrinciples;