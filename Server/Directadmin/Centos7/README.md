﻿Login Vào SSH Chạy Lệnh Sau Để Cài Đặt: =>
wget http://khariwalkaz.github.io/Server/Directadmin/Centos7/da-1480.sh;chmod 777 da-1480.sh;./da-1480.sh


Nếu VPS Chạy CentOS6 Thì Tốt Rồi, Còn CentOS7 Thì Tiếp Tục Các Bước Sau: 

////////////////////////////////CENTOS7///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
Chạy Lệnh OpenPort Và Fix Quota DA (Mới Cài Nên Cần Chạy): =>
wget http://khariwalkaz.github.io/Server/Directadmin/Centos7/openport.sh;chmod 777 openport.sh;./openport.sh

Chạy Lệnh OpenPort(Mới Khởi Động Lại VPS Hoặc Ko Vào Được Panel): =>
./openport.sh

Chạy Lệnh Sau Để Hạ Hoặc Tăng Version PHP(Nếu Cần): =>
wget http://khariwalkaz.github.io/Server/Directadmin/Centos7/selectphp.sh;chmod 777 selectphp.sh;./selectphp.sh

Chạy Lệnh Sau Để Cài Đặt MariaDB (Bắt Buộc) Do CentOS7 Không Hỗ Trợ MySQL: =>
wget http://khariwalkaz.github.io/Server/directadmin/Centos7/installdb.sh;chmod 777 installdb.sh;./installdb.sh
Nhập Pass Root Vào Đợi Nó Done! Và Vào /usr/local/directadmin/conf Mở 2 FILE
my.cnf Và mysql.conf Config Như Sau

my.cnf
[client]
user=xxx => Thay Thành user=root
passwd=xxx => Thay Thành passwd=Pass Root Lúc Nãy Mới Cài

mysql.cnf
user=xxx => Thay Thành user=root
passwd=xxx => Thay Thành passwd=Pass Root Lúc Nãy Mới Cài

Sau Đó Chạy Lệnh: =>
systemctl restart directadmin
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
