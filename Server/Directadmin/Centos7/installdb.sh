
#!/bin/sh

#############################
#############################
##_INSTALL_DATABASE_BY_HAU_##
#############################
#############################

yum install -y mariadb mariadb-server
systemctl start mariadb.service
systemctl enable mariadb.service
cd /usr/bin;
rm -rf mysql_secure_installation
wget http://hotlike.net/mysql_secure_installation
chmod 777 mysql_secure_installation
/usr/bin/mysql_secure_installation
