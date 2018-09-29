export default class uploadImg {
    constructor(imgMaxSize, url, format) {
        this.imgFile = {}
        this.file = null
        this.imgMaxSize = imgMaxSize
        this.url = url
        this.format = format
    }
    // 将file转成dataUrl
    transformFileToDataUrl(file) {
        const imgCompassMaxSize = 200 * 1024; // 超过 200k 就压缩
        // 存储文件相关信息
        this.imgFile.type = file.type || 'image/jpeg'; // 部分安卓出现获取不到type的情况
        this.imgFile.size = file.size;
        this.imgFile.name = file.name;
        this.imgFile.lastModifiedDate = file.lastModifiedDate;
        // 封装好的函数
        const reader = new FileReader();
        // file转dataUrl是个异步函数，要将代码写在回调里
        reader.onload = (e) => {
            // return new Promise((resolve,reject)=>{
            // })
            const result = e.target.result;
            if (result.length < imgCompassMaxSize) {
                this.compress(result, this.processData, false); // 图片不压缩
            } else {
                this.compress(result, this.processData); // 图片压缩
            }
        };
        reader.readAsDataURL(file);
    }
    handleInputChange(event) {
        // 获取当前选中的文件
        // console.log(this)
        this.file = event.target.files[0];
        // const imgMasSize = 1024 * 1024 * 10; // 10MB
        // 检查文件类型

        //   if (!['jpeg', 'png', 'gif', 'jpg'].includes(this.file.type.split("/")[1])) {
        //       // 自定义报错方式
        //       // Toast.error("文件类型仅支持 jpeg/png/gif！", 2000, undefined, false);
        //       alert("文件类型仅支持 jpeg/png/gif！")
        //       return;
        //   }
        if (this.format.length) {
            const _file_format = this.file.name.split('.').pop().toLocaleLowerCase();
            const checked = this.format.some(item => item.toLocaleLowerCase() === _file_format);
            if (!checked) {
                // this.onFormatError(this.file);
                return false;
            }
        }


        // 文件大小限制
        //   if (this.file.size > this.imgMasSize) {
        //       // 文件大小自定义限制
        //       // Toast.error("文件大小不能超过10MB！", 2000, undefined, false);
        //       alert("文件大小不能超过10MB！")
        //       return;
        //   }
        if (this.imgMaxSize) {
            if (this.file.size > this.imgMaxSize * 1024) {
                // this.onExceededSize(this.file);
                return false;
            }
        }
        // 判断是否是ios
        // if (!!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        //     // iOS
        //     this.transformFileToFormData(this.file);
        //     return;
        // }
        // 图片压缩之旅
        // console.log(this)
        this.transformFileToDataUrl(this.file);
    }
    // 使用canvas绘制图片并压缩
    compress(dataURL, shouldCompress = true) {
        const img = new window.Image();
        img.src = dataURL;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let compressedDataUrl;
            if (shouldCompress) {
                compressedDataUrl = canvas.toDataURL(this.imgFile.type, 0.2);
            } else {
                compressedDataUrl = canvas.toDataURL(this.imgFile.type, 1);
            }
            this.processData(compressedDataUrl)
            // callback(compressedDataUrl);
        }
    }
    // 将File append进 FormData
    transformFileToFormData(file) {
        const formData = new FormData();
        // 自定义formData中的内容
        // type
        formData.append('type', file.type);
        // size
        formData.append('size', file.size || "image/jpeg");
        // name
        formData.append('name', file.name);
        // lastModifiedDate
        formData.append('lastModifiedDate', file.lastModifiedDate);
        // append 文件
        formData.append('file', file);
        // 上传图片
        uploadImg(formData);
    }
    processData(dataURL) {
        // 这里使用二进制方式处理dataUrl
        const binaryString = window.atob(dataURL.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(binaryString.length);
        const intArray = new Uint8Array(arrayBuffer);
        console.log(this)
        const imgFile = this.imgFile;

        for (let i = 0, j = binaryString.length; i < j; i++) {
            intArray[i] = binaryString.charCodeAt(i);
        }
        const data = [intArray];
        let blob;
        try {
            blob = new Blob(data, {
                type: imgFile.type
            });
        } catch (error) {
            window.BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder;
            if (error.name === 'TypeError' && window.BlobBuilder) {
                const builder = new BlobBuilder();
                builder.append(arrayBuffer);
                blob = builder.getBlob(imgFile.type);
            } else {
                // Toast.error("版本过低，不支持上传图片", 2000, undefined, false);
                throw new Error('版本过低，不支持上传图片');
            }
        }
        // blob 转file
        const fileOfBlob = new File([blob], imgFile.name);
        const formData = new FormData();
        // type
        formData.append('type', imgFile.type);
        // size
        formData.append('size', fileOfBlob.size);
        // name
        formData.append('name', imgFile.name);
        // lastModifiedDate
        formData.append('lastModifiedDate', imgFile.lastModifiedDate);
        // append 文件
        formData.append('file', fileOfBlob);
        console.log(formData)
        this.uploadImg(formData);
    }
    // 上传图片
    uploadImg(formData) {
        fetch(this.url, {
            method: 'POST',
            body: formData,
            mode: 'cors',
            credentials: 'include'
        }).then(res => {
            console.log(res)
        })
    }
}
// let up = new uploadImg()
// document.getElementById('upload').addEventListener('change', up.handleInputChange.bind(up))