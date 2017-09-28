# Programs

### Contents
- [EPEL release]()
- [Brother printer]()
- [Anaconda]()
- [R]()
- [OS install tools]()

### [EPEL
release](https://www.tecmint.com/how-to-enable-epel-repository-for-rhel-centos-6-5/)

[EPEL
FAQ](https://fedoraproject.org/wiki/EPEL/FAQ#How_can_I_install_the_packages_from_the_EPEL_software_repository.3F)

```bash
wget https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
yum localinstall -y epel-release-latest-*.noarch.rpm
```
###### [Top]()

### Brother printer

Search online at brothers website for printer model and follow download link
from
[there](http://support.brother.com/g/b/downloadend.aspx?c=us&lang=en&prod=hll2340dw_us_eu_as&os=127&dlid=dlf006893_000&flang=4&type3=625)

```bash
chmod +x linux-brprinter-installer-2.1.1-1
yum install -y linux-brprinter-installer-2.1.1-1
```
- model name:HL-L2340DW
- when prompted, say yes
- configure by IP address (7): 192.168.1.132

If this doesnt work, follow instructions on website:
```bash
gunzip linux-brprinter-installer-2.1.1-1.gz
bash linux-brprinter-installer-2.1.1-1 HL-L2340DW
```
###### [Top]()

### [Anaconda](https://www.continuum.io/downloads#linux)

Do not heed warning - allow the path variable to change

```bash
wget https://repo.continuum.io/archive/Anaconda3-4.4.0-Linux-x86_64.sh
bash Anaconda3*.sh
rm Anaconda3*.sh
```
###### [Top]()

### R

- [R](https://cran.rstudio.com/)
- [RStudio](https://www.rstudio.com/products/rstudio/download/)
- [help](https://superuser.com/questions/841270/installing-r-on-rhel-7)
- see EPEL FAQ from above for more information on downloading the latest EPEL
  packages

```bash
# dependencies - you may need to install the latest epel release as well
wget http://mirror.centos.org/centos/7/os/x86_64/Packages/texinfo-tex-5.1-4.el7.x86_64.rpm
wget http://mirror.centos.org/centos/7/os/x86_64/Packages/texlive-epsf-doc-svn21461.2.7.4-38.el7.noarch.rpm
wget http://mirror.centos.org/centos/7/os/x86_64/Packages/texlive-epsf-svn21461.2.7.4-38.el7.noarch.rpm

yum localinstall -y texlive-epsf-doc-svn21461.2.7.4-38.el7.noarch.rpm
yum localinstall -y texlive-epsf-svn21461.2.7.4-38.el7.noarch.rpm
yum localinstall -y texinfo-tex-5.1-4.el7.x86_64.rpm

# R and RStudio
yum install -y R
wget https://download1.rstudio.org/rstudio-1.0.143-x86_64.rpm
yum install -y rstudio*.rpm
```
###### [Top]()

### OS install tools
- [rufus](https://rufus.akeo.ie): booting distros off of USB drive
- [imageUSB](http://www.osforensics.com/tools/write-usb-images.html): good for "zeroing" a usb drive and resetting it back to its original state
- [Windows 10 USB
  boot](https://www.microsoft.com/en-us/software-download/windows10): install
Windows 10 from a bootable USB drive
- [magic jelly bean key finder](https://www.magicaljellybean.com/): for finding
  Windows 10 and Office keys

###### [Top]()
