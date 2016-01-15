# JS: Photo Album

<img src="/screenshots/photoslist.jpg?raw=true" height="300">

## Overview

A simple photo album web-site where users can upload their photos, view photos of others and rate them using likes. The site is written as a single page application without using any MVC frameworks.

## Details

### Back-End

The application is a Spring Boot app which uses a MySQL database for storing photos and other information. The part responsible for providing the photos data to clients is implemented as a REST servirce. Uploaded images are compressed with ImageMagick (which should be installed) and the corresponding data can be retreived by parsing url query paramter and using QueryDSL.

### Front-end

The JavaScript files are structured in the following way: controllers, views, libraries and polyfills, and various helper classes. Everything is bundled into corresponding files by webpack and sass, running as grunt tasks. Currently there are issues with IE8 being unable to properly render templates and transparent pngs. IE9, FF and Chrome seem to work just fine.

Slider images were taken from https://www.pexels.com
