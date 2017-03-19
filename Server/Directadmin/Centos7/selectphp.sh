#!/bin/sh

#############################
#############################
#####_SELECT_PHP_BY_HAU_#####
#############################
#############################

echo -n "Chon Phien Ban PHP Muon Su Dung (5.3|5.4|5.5|5.6|7.0): "
read VERSION
if [ "$VERSION" = "" ]
then
	VERSION=5.4
fi
cd /usr/local/directadmin/custombuild
./build update
./build set php1_release $VERSION
./build php n
./build set zend yes
./build zend
./build set ioncube yes
./build ioncube
clear
echo "Done!"
php -v
