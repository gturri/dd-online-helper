<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class Kernel extends BaseKernel
{
	use MicroKernelTrait;

	public function handle(Request $request, int $type = HttpKernelInterface::MAIN_REQUEST, bool $catch = true): Response {
		if($this->isRequestToBeHandledByTheFront($request)) {
			// TODO: this does not feel right: reading and returning a "public" asset feels like
			// something Symfony knows how to do, and that this code is reinventing the wheel...
			$content = file_get_contents($this->getProjectDir() . "/public/index.html");
			$response = new Response($content);
			$response->prepare($request);
			return $response;
		}
		return parent::handle($request, $type, $catch);
	}

	private function isRequestToBeHandledByTheFront(Request $request): bool {
		return !str_starts_with($request->server->get("PATH_INFO"), "/api");
	}
}
