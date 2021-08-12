import React, { useState } from "react";
import ImageUpload from "./shared/FormElements/ImageUpload";
import { useForm } from "./shared/hooks/form-hook";

const Imagetest = () => {
  const [formState, inputHandler] = useForm();
  const [value, setValue] = useState();
  const [image, setBackImage] = useState(false);
  const handleImageChange = (e) => {
    setValue({
      ...value,
      image: e.target.files[0],
    });

    console.log(e.target.files[0]);
  };
  const handleImageSubmit = (e) => {
    e.preventDefault();
    let fetchData;
    try {
      fetchData = async () => {
        let data = new FormData();
        data.append("image", value.image);
        const response = await fetch("https://localhost:5000/api/fetch-image", {
          method: "POST",
          body: data,
        });
<<<<<<< HEAD
        const result = await response;
        console.log(result);
        if (response.ok) {
          console.log("done");
          setBackImage(true);
          setValue({image: result})
=======
        const result = await response.json();
        if (response.ok) {
          console.log("done");
          setBackImage({data: result.decoded})
>>>>>>> b0d55164cb932f2750b566aba90693e6c222b3bb
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  };
  return (
    <div>
      <ImageUpload
        center
        id="image"
        onInput={inputHandler}
        errorText="Please provide an image"
      />
      <input
        type="file"
        id="image"
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
        required
      />
      {image && <img src={`data:image/png;base64,${value.image}`} /> }
      <button onClick={handleImageSubmit}>submit</button>
    </div>
  );
};

export default Imagetest;
