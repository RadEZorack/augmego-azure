# # syntax=docker/dockerfile:1
# FROM python:3
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1
# WORKDIR /code
# COPY requirements.txt /code/
# RUN pip install -r requirements.txt
# COPY . /code/

#########
FROM ubuntu:20.04

# Set up ALL os-level dependencies
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    # coredeps
    ntp python3 python3-pip git nginx wget tar sudo make

# Set up requirements.txt dependencies
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    # requirement deps
    build-essential libssl-dev libffi-dev libpq-dev python3-dev ffmpeg libsm6 libxext6

RUN pip3 install --upgrade pip

# Geospatial libraries https://docs.djangoproject.com/en/3.1/ref/contrib/gis/install/geolibs/#geosbuild
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    # GeoDjango deps
    binutils libproj-dev gdal-bin

# Run on postgressql
# apt-get update \
#    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
#    postgis postgresql-15-postgis-3
# apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y postgis postgresql-15-postgis-3

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    # AioRTC deps
    pkg-config libvpx-dev libopus-dev libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libavfilter-dev libswscale-dev libswresample-dev opus-tools

###########

# RUN apt-get update \
#     && DEBIAN_FRONTEND=noninteractive apt-get install -y \
#     python3-venv

# WORKDIR /code
# RUN python3 -m venv /code/venv

# RUN /code/venv/bin/pip install av
# RUN /code/venv/bin/pip install aiortc==1.6.0
# COPY requirements.txt .
# RUN /code/venv/bin/pip install -r requirements.txt

# COPY . /code/

RUN pip3 install av
RUN pip3 install aiortc==1.2.0
COPY requirements.txt ./
RUN pip3 install -r requirements.txt

WORKDIR /code/
COPY . /code/

# This is for MAC OS
ENV LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libgomp.so.1

RUN mkdir -p /code/quickstartproject/collectedstaticfiles \
    && chown -R 1000 /code/quickstartproject/collectedstaticfiles \
    && python3 manage.py collectstatic --noinput

COPY /certs/ /usr/local/share/ca-certificates/
RUN update-ca-certificates



# EXPOSE 80
# CMD ["/code/venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]
# CMD ["daphne", "mysite.asgi:application", "--port", "8000"]
