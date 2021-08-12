from PIL import Image
import io
import base64


class ImageConvert:

    @staticmethod
    def convert_to_b64(img):
        ext = img.mimetype.split("/")[1].upper()
        im = Image.open(img)
        data = io.BytesIO()
        im.save(data, ext, quality=20, optimize=True)
        decoded_img_data = base64.b64encode(data.getvalue()).decode('utf-8')
        return decoded_img_data
