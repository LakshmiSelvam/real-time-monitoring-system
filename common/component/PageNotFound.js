import img from "../../assets/images/pageNotFound.avif";
import "../Style/pageNotFound.css";
import { useNavigate } from "react-router-dom";
function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="page-not-found-container">
      <div className="page-not-found-inner-container">
        <div className="content-container">
          <p>Something went wrong !!!</p>
          <p className="page-not-found-message">
            Looks like you've followed a broken link or entered a URL that does
            not exit on this site.
          </p>
          <button className="back-to-page" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="image-container">
          <img src={img} alt="page not found" />
        </div>
      </div>
    </div>
  );
}
export default PageNotFound;
