# copy the right js file for generating Korean svg font
cp public/javascripts/os2.js node_modules/svg2ttf/lib/ttf/tables/.

# download pre-trained model from our one drive
wget -O ./pre-trained.tgz "https://mysnu-my.sharepoint.com/personal/yu65789_seoul_ac_kr/_layouts/15/guestaccess.aspx?docid=0a7fcfabb78af4958b790b98eccac135c&authkey=AVqeaI5jyQHWyklZgotc04Y"

# unzip the model
tar -zxf pre-trained.tgz

# place the model in the right place
mkdir neural-fonts/binary
mv baseline neural-fonts/binary/.

# remove the model
rm pre-trained.tgz
