```
git clone --recursive https://github.com/transpect/calabash-frontend calabash
git clone https://github.com/transpect/docx2hub
git clone https://github.com/transpect/htmlreports
git clone https://github.com/transpect/xslt-util
git clone https://github.com/transpect/xproc-util
git clone https://github.com/kakwa/libemf2svg

docker image build -t docx_converter .
docker container run -p 7749:7749 -d docx_converter
```# emf2svg
