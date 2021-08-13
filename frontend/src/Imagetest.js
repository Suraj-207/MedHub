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
        const result = await response.json();
        if (response.ok) {
          console.log("done");
          setBackImage({data: result.decoded})
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
      {image && <img src={`data:image/png;base64,${image.data}`} /> }
      <button onClick={handleImageSubmit}>submit</button>
    </div>
  );
};

export default Imagetest;
