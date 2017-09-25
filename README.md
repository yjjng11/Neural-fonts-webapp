# Neural-fonts-webapp


Introduction
---
Neural fonts web app 은디자이너에게 손글씨 양식을 제공하고, 작성된 양식을 서버로 전송합니다. 후에 서버에서 학습한 인공신경망으로 생성된 글자들을 사용자에게 보여줍니다. 원하는 글자들을 선택하도록 하여 인공신경망의 재학습을 유도할 수도 있습니다. 또한 이미지 편집, history 저장, 최종 결과물 다운로드 기능을 제공합니다.

Technology stack
-----
* express
* nodejs
* bootstrap
* Tensorflow
* python
* ...

How to Use
----------
### Installation & Execution
1. Install Node.js
2. Install NPM, if necessary
3. Install NPM packages
	> $ npm install
	
4. Run
	> $ node app.js
	
	Then Neural fonts web app will be available at: localhost:3000

### In web page
1. 798자의 글자를 적을 수 있는 손글씨 양식을 다운받은 후 직접 본인의 손글씨를 적어 스캔하거나 illustrator 등의 도구를 이용해 한글 디자인을 제작합니다. 이 때, 필요하다면 본 개발진이 준비해놓은 예제를 확인할 수 있습니다.

2. 시작하기 버튼을 클릭하고 준비한 파일을 업로드 합니다.

	> 업로드한 파일은 public 폴더에 저장됩니다. 

3. Neural fonts 는 업로드된 한글 디자인을 학습합니다. 이 과정은 한글 디자인을 흉내내는 인공신경망이 학습되는 과정으로, Titan X GPU 를 가진 서버에서 대략 1시간 가량이 걸리게 됩니다.

4. 학습이 끝나면 생성된 글자 디자인의 샘플이 보여집니다. 만약 샘플이 마음에 든다면 전체 글자의 디자인을 다운로드할 수 있으며, 마음에 들지 않는다면 생성된 글자들 중 마음에 드는 글자들만 골라서 인공신경망을 다시 학습시킬 수 있습니다. (재학습을 하게 되면 인공신경망은 더 많은 글자들의 디자인을 학습하게 되므로 더 나은 글자를 생성할 수 있을 것입니다).

	>- 이외에 illustrator와 같이 전문적인 이미지 편집 툴을 가지고 계시지 않은 분들을 위해, 인공신경망이 생성한 글자 디자인을 직접 수정할 수 있는 간단한 이미지 편집 기능이 포함되어 있습니다.

	>- 각각의 속성들은 스크롤바를 이용해 조절합니다. save 버튼을 클릭하면 그 당시의 상태를 불러올 수 있는 버튼이 history 부분에 생성됩니다.

6. 최종적으로 완성된 폰트 파일(.ttf) 을 다운받을 수 있습니다.


### How to make fonts file

Neural fonts web app은 글자 이미지 파일(.png)에서 폰트 파일(.ttf)을 생성합니다.

> 1. 서버에서 생성한 png 이미지 파일을 svg 이미지 파일로 변환합니다. 이는 svg 폴더에 저장됩니다.
> 2. svg 이미지파일을 svg font 파일로 변환합니다. 이는 svg font 폴더에 저장됩니다.
> 3. svg font 파일에서 ttf font 파일을 생성합니다. 결과물은 ttf font 폴더에서 확인할 수 있습니다.






License
-----
MIT.
	
