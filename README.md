# JS: Photo Album

## Overview

A simple photo album web-site where users can upload their photos, view photos of others and rate them using likes. The site is written as a single page application without using any MVC frameworks.

## Details

### Back-End

The application is a Spring Boot app and uses a MySQL database for storing photos and other information. The part responsible for providing the photos data to clients is implemented as a REST servirce. Also, a query parser for using QueryDSL in JPA is used. Thymeleaf is used a templating language for HTML pages.

### Front-end

The JavaScript files are structured in the following way: controllers, views, libraries and polyfills, and various helper classes. Everything is bundled into corresponding files by webpack and sass, running as grunt tasks. Currently there are issues with IE8 being unable to properly render templates and transparent pngs. IE9, FF and Chrome seem to work just fine.

Slider images were taken from https://www.pexels.com
