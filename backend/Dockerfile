# Use an official PHP runtime as a parent image
FROM php:7.4-fpm

# Set the working directory to /app
WORKDIR /app

# Install any necessary packages
RUN apt-get update && \
    apt-get install -y \
        nginx \
        curl \
        git \
        zip \
        unzip \
        libpq-dev \
        libzip-dev \
        libjpeg-dev \
        libpng-dev \
        libfreetype6-dev \
        libonig-dev

# Set environment variables for oniguruma library
ENV ONIG_CFLAGS="-I/usr/include/oniguruma"
ENV ONIG_LIBS="-L/usr/lib/x86_64-linux-gnu -lonig"

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath zip gd

# Install Composer globally
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Remove the default Nginx configuration file
RUN rm /etc/nginx/sites-enabled/default

# Copy Nginx configuration
COPY slim.conf /etc/nginx/sites-available/

# Create a symbolic link to enable the Nginx configuration file
RUN ln -s /etc/nginx/sites-available/slim.conf /etc/nginx/sites-enabled/

# Copy project files into the container
COPY . /app

# Remove the composer.lock file or return true
# RUN rm composer.lock
RUN [ -f composer.lock ] && rm composer.lock || true

# Install project dependencies
RUN composer install

# Expose port 80
EXPOSE 80

# Start Nginx and PHP-FPM services
CMD service nginx start && php-fpm
